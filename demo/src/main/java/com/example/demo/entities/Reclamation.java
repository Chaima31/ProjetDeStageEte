package com.example.demo.entities;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;


@Entity
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @ManyToOne
    private Locateur locateur;

    public Reclamation() {
        // No-argument constructor
    }

    public Reclamation(Long id, String message, Locateur locateur) {
        this.id = id;
        this.message = message;
        this.locateur = locateur;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Locateur getLocateur() {
        return locateur;
    }

    public void setLocateur(Locateur locateur) {
        this.locateur = locateur;
    }
}
