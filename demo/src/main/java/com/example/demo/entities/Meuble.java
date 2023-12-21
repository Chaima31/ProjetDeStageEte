package com.example.demo.entities;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.OneToMany;
@Entity
public class Meuble {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String nom;
	private int syndic_day_Id;
    private int syndic_night_Id;
	@OneToMany(cascade = CascadeType.REMOVE)
	private List<Appartement> appartement;
	
	 @Override
	    public String toString() {
	        return nom;
	    }

	public int getSyndic_day_Id() {
		return syndic_day_Id;
	}

	public void setSyndic_day_Id(int syndic_day_Id) {
		this.syndic_day_Id = syndic_day_Id;
	}

	public int getSyndic_night_Id() {
		return syndic_night_Id;
	}

	public void setSyndic_night_Id(int syndic_night_Id) {
		this.syndic_night_Id = syndic_night_Id;
	}

	public List<Appartement> getAppartement() {
		return appartement;
	}

	public void setAppartement(List<Appartement> appartement) {
		this.appartement = appartement;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	 public List<Appartement> getAppartements() {
	        return appartement;
	    }

	    public void setAppartements(List<Appartement> appartements) {
	        this.appartement = appartements;
	    }

		public void setId(int id2) {
			// TODO Auto-generated method stub
			 this.id = id2;
		}
		
		public int getId() {
			return id;
		}
	
}
