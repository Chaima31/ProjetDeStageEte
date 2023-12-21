package com.example.demo.entities;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;


@Entity
public class Locateur extends Personne {
	
	
	
	@OneToMany(mappedBy = "locateur")
	private List<Appartement> appartements;
	
	private long tele;	
	private String type;	
	private int depense;	
	private String vehicule;
	private String matricule;
	
	public String getVehicule() {
		return vehicule;
	}


	public void setVehicule(String Vehicule) {
		vehicule = Vehicule;
	}


	public String getMatricule() {
		return matricule;
	}


	public void setMatricule(String Matricule) {
		matricule = Matricule;
	}
	
	
	public Locateur() {
		super();
		this.setRole("Locateur");
	}
	

	public Locateur(long tele, String type, int depense, String password) {
		super();
		
		this.tele = tele;
		this.type = type;
		this.depense = depense;
		 // Hash the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.setPassword(passwordEncoder.encode(password));

        // Set the default role
        this.setRole("Locateur");
		
	}
	
	
	
	public long getTele() {
		return tele;
	}
	public void setTele(long tele) {
		this.tele = tele;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getDepense() {
		return depense;
	}
	public void setDepense(int depense) {
		this.depense = depense;
	}
	
	
	

	
	

}
