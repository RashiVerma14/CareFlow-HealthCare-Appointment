package com.careflow.patient;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PatientRepository extends MongoRepository<Patient, String> {
  Optional<Patient> findByUserId(String userId);
}
