package com.careflow.config;

import com.careflow.appointment.Appointment;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

@Configuration
public class MongoIndexConfig {

    @Bean
    CommandLineRunner createAppointmentIndexes(MongoTemplate mongoTemplate) {
        return args -> {

            mongoTemplate.indexOps(Appointment.class)
                    .ensureIndex(
                            new Index()
                                    .on("doctorId", Sort.Direction.ASC)
                                    .on("slotStart", Sort.Direction.ASC)
                                    .unique()
                    );
        };
    }
}
