package com.example.demo.entities;



import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Entity;

@Entity
public class Admin   extends Personne {
	private String adresse ;
	
	

	public Admin() {
		super();
		this.setRole("Admin");
	}

	public Admin(String adresse) {
		super();
		this.adresse = adresse;
		
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		this.setPassword(passwordEncoder.encode(password));
	}
	

	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}

}
