package com.example.demo.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.List;

@Entity
public class Annonce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String filenam;

   

    @ManyToMany(cascade = CascadeType.REMOVE)
    private List<Locateur> locateur; // List of Locateur entities

    // Add a field to store the file URL
    private String fileUrl;

    public Annonce(Long id, String message,String filenam, List<Locateur> locateur, String fileUrl) {
        super();
        this.id = id;
        this.message = message;
        this.message = filenam;
        this.locateur = locateur;
        this.fileUrl = fileUrl;
    }

    public Annonce() {
        super();
    }

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

    public List<Locateur> getLocateur() {
        return locateur;
    }

    public void setLocateur(List<Locateur> locateur) {
        this.locateur = locateur;
    }

    // Getter and Setter for the file URL
    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    public String getFilenam() {
		return filenam;
	}

	public void setFilenam(String filenam) {
		this.filenam = filenam;
	}
}
