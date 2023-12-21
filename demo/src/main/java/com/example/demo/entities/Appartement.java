package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Appartement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int numero;
    
    
 
	@ManyToOne
    private Proprietaire proprietaire;
	@ManyToOne
    private Locateur locateur;
	
    @ManyToOne
    private Meuble meuble;
    
   
   

    public Appartement(int id, int numero, Proprietaire proprietaire,Locateur locateur, Meuble meuble) {
		super();
		this.id = id;
		this.numero = numero;
		this.proprietaire = proprietaire;
		this.locateur = locateur;
		this.meuble = meuble;
		
	}

	public Appartement() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public Proprietaire getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Proprietaire proprietaire) {
        this.proprietaire = proprietaire;
    }

    public Meuble getMeuble() {
        return meuble;
    }

    public void setMeuble(Meuble meuble) {
        this.meuble = meuble;
    }

   

	public Locateur getLocateur() {
		return locateur;
	}

	public void setLocateur(Locateur locateur) {
		this.locateur = locateur;
	}
  

}
