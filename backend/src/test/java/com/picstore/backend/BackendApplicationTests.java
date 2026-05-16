package com.picstore.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.picstore.backend.model.Observation;
import com.picstore.backend.repository.ObservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class BackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObservationRepository observationRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		// Clear the database before each test to ensure test isolation
		observationRepository.deleteAll();
	}

	@Test
	void contextLoads() {
		// Standard Spring context load test
	}

	@Test
	void integration_addObservationAndGetAll_ShouldPersistInDatabase() throws Exception {
		// Create a new observation object
		Observation observation = new Observation();
		observation.setSpeciesName("Integration Bird");
		observation.setCategoryId(5);

		// Perform HTTP POST to save the observation
		mockMvc.perform(post("/api/observations")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(observation)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.speciesName").value("Integration Bird"));

		// Perform HTTP GET to verify it was persisted
		mockMvc.perform(get("/api/observations"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].speciesName").value("Integration Bird"))
				.andExpect(jsonPath("$[0].categoryId").value(5));
	}

	@Test
	void integration_updateObservation_ShouldModifyExistingData() throws Exception {
		// Save initial data directly to the database
		Observation observation = new Observation();
		observation.setSpeciesName("Old Name");
		observation.setCategoryId(1);
		Observation saved = observationRepository.save(observation);

		// Prepare updated data
		Observation details = new Observation();
		details.setSpeciesName("Updated Name");
		details.setCategoryId(9);

		// Perform HTTP PUT to update the observation
		mockMvc.perform(put("/api/observations/" + saved.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(details)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.speciesName").value("Updated Name"))
				.andExpect(jsonPath("$.categoryId").value(9));
	}

	@Test
	void integration_deleteObservation_ShouldRemoveDataFromDatabase() throws Exception {
		// Save initial data directly to the database
		Observation observation = new Observation();
		observation.setSpeciesName("To Be Deleted");
		observation.setCategoryId(2);
		Observation saved = observationRepository.save(observation);

		// Perform HTTP DELETE
		mockMvc.perform(delete("/api/observations/" + saved.getId()))
				.andExpect(status().isOk());

		// Verify the database is now empty
		mockMvc.perform(get("/api/observations"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}