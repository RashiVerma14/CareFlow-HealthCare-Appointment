package com.careflow.config;

import com.careflow.appointment.Appointment;
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

            Document keys = new Document()
                    .append("doctorId", 1)
                    .append("slotStart", 1);

            Document partialFilter = new Document(
                    "status",
                    new Document("$in", java.util.List.of("HELD", "CONFIRMED"))
            );

            IndexOptions options = new IndexOptions()
                    .unique(true)
                    .partialFilterExpression(partialFilter);

            mongoTemplate
                    .getCollection("appointments")
                    .createIndex(keys, options);
        };
    }
}
