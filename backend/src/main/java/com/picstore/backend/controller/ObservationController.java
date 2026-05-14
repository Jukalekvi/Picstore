package com.picstore.backend.controller;

import com.picstore.backend.model.Observation;
import com.picstore.backend.repository.ObservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("api/observations")
@RequiredArgsConstructor // Lombok will automatically bring in a constructor, with which the repository will be brought in
public class ObservationController {

    @Autowired
    private ObservationRepository observationRepository;

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

    //Delete an observation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteObservation(@PathVariable Long id) {
        if (observationRepository.existsById(id)) {
            observationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Edit an observation
    @PutMapping("/{id}")
    public ResponseEntity<Observation> updateObservation(@PathVariable Long id, @RequestBody Observation details) {
        return observationRepository.findById(id)
                .map(observation -> {
                    observation.setSpeciesName(details.getSpeciesName());
                    // We can decide if we want to allow updating location or image here too
                    Observation updated = observationRepository.save(observation);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
