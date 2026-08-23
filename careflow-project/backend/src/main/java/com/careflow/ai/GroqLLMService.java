package com.careflow.ai;

import com.careflow.appointment.AiVisitSummary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GroqLLMService implements LLMService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GroqLLMService(
            ObjectMapper objectMapper,
            @Value("${careflow.groq-api-key:}") String apiKey,
            @Value("${careflow.groq-model:openai/gpt-oss-20b}") String model) {

        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    @Override
    public AiVisitSummary preVisitSummary(String symptoms) {

        String prompt = """
                Analyse these patient symptoms and return ONLY valid JSON.

                Required JSON format:
                {
                  "urgencyLevel": "Low",
                  "chiefComplaint": "short description",
                  "suggestedQuestions": [
                    "question 1",
                    "question 2",
                    "question 3"
                  ]
                }

                Rules:
                - urgencyLevel must be exactly Low, Medium, or High.
                - chiefComplaint should briefly summarize the main complaint.
                - suggestedQuestions must contain exactly three useful questions for the doctor.
                - Do not diagnose the patient.
                - Do not prescribe medication.
                - Base the response only on the symptoms provided.

                Symptoms:
                """ + symptoms;

        try {
            String response = callGroq(prompt);
            JsonNode json = objectMapper.readTree(response);

            AiVisitSummary summary = new AiVisitSummary();

            summary.generated = true;
            summary.generatedAt = Instant.now();

            summary.urgencyLevel =
                    json.path("urgencyLevel").asText("Low");

            summary.chiefComplaint =
                    json.path("chiefComplaint").asText(symptoms);

            summary.suggestedQuestions = new ArrayList<>();

            JsonNode questions = json.path("suggestedQuestions");

            if (questions.isArray()) {
                for (JsonNode question : questions) {
                    summary.suggestedQuestions.add(question.asText());
                }
            }

            while (summary.suggestedQuestions.size() < 3) {
                summary.suggestedQuestions.add(
                        "Are there any changes or worsening symptoms that should be discussed?"
                );
            }

            if (summary.suggestedQuestions.size() > 3) {
                summary.suggestedQuestions =
                        new ArrayList<>(
                                summary.suggestedQuestions.subList(0, 3)
                        );
            }

            return summary;

        } catch (Exception e) {
            return failedSummary(
                    "Groq AI was unavailable. The appointment was saved without an AI summary."
            );
        }
    }

    @Override
    public AiVisitSummary postVisitSummary(String clinicalNotes) {

        String prompt = """
                Convert these clinical notes into a clear, patient-friendly summary.

                Return ONLY valid JSON using this format:

                {
                  "patientFriendlySummary": "simple explanation of the visit",
                  "medicationSchedule": "simple medication instructions",
                  "followUpInstructions": "follow-up instructions"
                }

                Rules:
                - Use simple language that a patient can understand.
                - Do not invent information.
                - Do not add medications that are not present in the notes.
                - Do not provide a new diagnosis.
                - Preserve important instructions from the doctor.

                Clinical notes:
                """ + clinicalNotes;

        try {
            String response = callGroq(prompt);
            JsonNode json = objectMapper.readTree(response);

            AiVisitSummary summary = new AiVisitSummary();

            summary.generated = true;
            summary.generatedAt = Instant.now();

            summary.patientFriendlySummary =
                    json.path("patientFriendlySummary")
                            .asText(
                                    "Your doctor reviewed your visit and provided a care plan."
                            );

            summary.medicationSchedule =
                    json.path("medicationSchedule")
                            .asText(
                                    "Follow the medication instructions provided by your doctor."
                            );

            summary.followUpInstructions =
                    json.path("followUpInstructions")
                            .asText(
                                    "Follow the follow-up instructions provided by your doctor."
                            );

            return summary;

        } catch (Exception e) {
            return failedSummary(
                    "Groq AI was unavailable. The visit was saved without an AI-generated summary."
            );
        }
    }

    private String callGroq(String prompt) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GROQ_API_KEY is not configured"
            );
        }

        String requestBody = """
                {
                  "model": "%s",
                  "messages": [
                    {
                      "role": "system",
                      "content": "You are a healthcare documentation assistant. Provide structured summaries only. Do not diagnose or prescribe."
                    },
                    {
                      "role": "user",
                      "content": %s
                    }
                  ],
                  "temperature": 0.2,
                  "response_format": {
                    "type": "json_object"
                  }
                }
                """.formatted(
                model,
                objectMapper.valueToTree(prompt).toString()
        );

        JsonNode response = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        if (response == null) {
            throw new IllegalStateException("Empty response from Groq");
        }

        JsonNode content = response
                .path("choices")
                .path(0)
                .path("message")
                .path("content");

        if (content.isMissingNode() || content.asText().isBlank()) {
            throw new IllegalStateException(
                    "Groq returned an empty response"
            );
        }

        return content.asText();
    }

    private AiVisitSummary failedSummary(String reason) {

        AiVisitSummary summary = new AiVisitSummary();

        summary.generated = false;
        summary.failureReason = reason;
        summary.generatedAt = Instant.now();

        return summary;
    }
}
