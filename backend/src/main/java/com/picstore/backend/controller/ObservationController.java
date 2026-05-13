package com.picstore.backend.controller;

import com.picstore.backend.model.Observation;
import com.picstore.backend.repository.ObservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/observations")
@RequiredArgsConstructor // Lombok will automatically bring in a constructor, with which the repository will be brought in
public class ObservationController {
    private final ObservationRepository observationRepository;

    //Get all observations: GET http://IP:8080/api/observations
    @GetMapping
    public List<Observation> findAll(){
        return observationRepository.findAll();
    }

    //Save a new observation: POST http://IP:8080/api/observations
    @PostMapping
    public Observation add(@RequestBody Observation observation){
        return observationRepository.save(observation);
    }
}
