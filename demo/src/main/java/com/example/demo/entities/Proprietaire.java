package com.example.demo.entities;




import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Proprietaire extends Personne {
	
	
	private int tele;	

	
	@OneToMany
	private List<Appartement>  appartement;
	
	public List<Appartement> getAppartement() {
		return appartement;
	}

	public void setAppartement(List<Appartement> appartement) {
		this.appartement = appartement;
	}

	
	
	

    @Override
    public String toString() {
        return nom; // You can use any other property to display the name as needed.
    }
	
	 

	
    public Proprietaire() {
        super();
        this.setRole("Proprietaire");
    }
	
	
	
	 public Proprietaire( int tele, List<Appartement> appartement, String password) {
	        super();
	       
	        this.tele = tele;
	       
	        this.appartement = appartement;

	        // Hash the password using BCrypt
	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	        this.setPassword(passwordEncoder.encode(password));

	        // Set the default role
	        this.setRole("Proprietaire");
	    }



	public int getTele() {
		return tele;
	}

	public void setTele(int tele) {
		this.tele = tele;
	} 
	public Proprietaire orElse(Object object) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
	
	
	
	

}
