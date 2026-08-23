package com.careflow.config;

import com.mongodb.client.model.IndexOptions;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoIndexConfig {

    @Bean
    CommandLineRunner createAppointmentIndexes(MongoTemplate mongoTemplate) {
        return args -> {

            // Remove the old appointment index if it exists
            try {
                mongoTemplate
                        .getCollection("appointments")
                        .dropIndex("uniq_doctor_slot_active");
            } catch (Exception ignored) {
                // Index may not exist on a fresh database
            }

            // Only HELD and CONFIRMED appointments reserve a slot
            Document keys = new Document()
                    .append("doctorId", 1)
                    .append("slotStart", 1);

            Document partialFilter = new Document(
                    "status",
                    new Document("$in", java.util.List.of(
                            "HELD",
                            "CONFIRMED"
                    ))
            );

            IndexOptions options = new IndexOptions()
                    .unique(true)
                    .partialFilterExpression(partialFilter)
                    .name("uniq_doctor_slot_active");

            mongoTemplate
                    .getCollection("appointments")
                    .createIndex(keys, options);
        };
    }
}
