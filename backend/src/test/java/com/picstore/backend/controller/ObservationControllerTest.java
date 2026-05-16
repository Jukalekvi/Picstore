package com.picstore.backend.controller;

import com.picstore.backend.model.Observation;
import com.picstore.backend.repository.ObservationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ObservationControllerTest {

    @Mock
    private ObservationRepository observationRepository;

    @InjectMocks
    private ObservationController observationController;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void findAll_ShouldReturnList() {
        // Arrange
        Observation obs1 = new Observation();
        obs1.setId(1L);
        obs1.setSpeciesName("Bird");

        Observation obs2 = new Observation();
        obs2.setId(2L);
        obs2.setSpeciesName("Mammal");

        when(observationRepository.findAll()).thenReturn(Arrays.asList(obs1, obs2));

        // Act
        List<Observation> result = observationController.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bird", result.getFirst().getSpeciesName());
        verify(observationRepository, times(1)).findAll();
    }

    @Test
    void add_ShouldSaveAndReturnObservation() {
        // Arrange
        Observation newObs = new Observation();
        newObs.setSpeciesName("Insect");
        newObs.setCategoryId(4);

        Observation savedObs = new Observation();
        savedObs.setId(1L);
        savedObs.setSpeciesName("Insect");
        savedObs.setCategoryId(4);

        when(observationRepository.save(newObs)).thenReturn(savedObs);

        // Act
        Observation result = observationController.add(newObs);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Insect", result.getSpeciesName());
        assertEquals(4, result.getCategoryId());
        verify(observationRepository, times(1)).save(newObs);
    }

    @Test
    void updateObservation_ShouldUpdateCategoryAndName() {
        // Arrange
        Long obsId = 1L;
        Observation existingObs = new Observation();
        existingObs.setId(obsId);
        existingObs.setSpeciesName("Old Name");
        existingObs.setCategoryId(8);

        Observation details = new Observation();
        details.setSpeciesName("New Name");
        details.setCategoryId(2);

        when(observationRepository.findById(obsId)).thenReturn(Optional.of(existingObs));
        when(observationRepository.save(any(Observation.class))).thenReturn(existingObs);

        // Act
        ResponseEntity<Observation> response = observationController.updateObservation(obsId, details);

        // Assert
        assertNotNull(response.getBody());
        assertEquals(200, response.getStatusCode().value());
        assertEquals("New Name", response.getBody().getSpeciesName());
        assertEquals(2, response.getBody().getCategoryId());
        verify(observationRepository, times(1)).save(existingObs);
    }

    @Test
    void updateObservation_ShouldReturnNotFoundWhenIdDoesNotExist() {
        // Arrange
        Long obsId = 999L;
        Observation details = new Observation();
        details.setSpeciesName("Ghost Species");

        when(observationRepository.findById(obsId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Observation> response = observationController.updateObservation(obsId, details);

        // Assert
        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());
        verify(observationRepository, never()).save(any(Observation.class));
    }

    @Test
    void deleteObservation_ShouldReturnOkWhenFound() {
        // Arrange
        Long obsId = 1L;
        when(observationRepository.existsById(obsId)).thenReturn(true);

        // Act
        ResponseEntity<Void> response = observationController.deleteObservation(obsId);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        verify(observationRepository, times(1)).deleteById(obsId);
    }

    @Test
    void deleteObservation_ShouldReturnNotFoundWhenIdDoesNotExist() {
        // Arrange
        Long obsId = 999L;
        when(observationRepository.existsById(obsId)).thenReturn(false);

        // Act
        ResponseEntity<Void> response = observationController.deleteObservation(obsId);

        // Assert
        assertEquals(404, response.getStatusCode().value());
        verify(observationRepository, never()).deleteById(anyLong());
    }
}