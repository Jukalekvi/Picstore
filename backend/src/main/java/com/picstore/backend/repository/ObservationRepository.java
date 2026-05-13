package com.picstore.backend.repository;

import com.picstore.backend.model.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
    public interface ObservationRepository extends JpaRepository<Observation, Long>{
    }
