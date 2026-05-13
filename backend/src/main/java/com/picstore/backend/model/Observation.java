package com.picstore.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity // Mark this as a database table
@Table(name = "observations")
@Data // Lombok creates getters, setters, toString, etc.
@NoArgsConstructor // JPA needs an empty constructor
@AllArgsConstructor // Constructor for all fields
public class Observation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String speciesName;

    private String imagePath;

    // Fields for location coordinates
    private Double latitude;

    private Double longitude;

    private LocalDateTime timestamp;

    // This method runs automatically before the entity is saved to the database
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}