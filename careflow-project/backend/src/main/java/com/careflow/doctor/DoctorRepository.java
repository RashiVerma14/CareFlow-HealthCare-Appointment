package com.careflow.doctor;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
  List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
