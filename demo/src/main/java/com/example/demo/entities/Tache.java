package com.example.demo.entities;


import java.time.LocalDate;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    
    
	private LocalDate datedebut;
    
	
	private LocalDate datedefin;

	private Long syndic_id;
    
	private String  etat;
    


	public Tache() {
		super();
		// TODO Auto-generated constructor stub
	}


	


	public Tache(Long id, String description, LocalDate datedebut, LocalDate datedefin, Long syndic_id,String etat) {
		super();
		this.id = id;
		this.description = description;
		this.datedebut = datedebut;
		this.datedefin = datedefin;
		this.syndic_id = syndic_id;
		this.setEtat(etat);
	}


	public Long getId() {
		return id;
	}





	public void setId(Long id) {
		this.id = id;
	}





	public String getDescription() {
		return description;
	}





	public void setDescription(String description) {
		this.description = description;
	}





	public LocalDate getDatedebut() {
		return datedebut;
	}





	public void setDatedebut(LocalDate datedebut) {
		this.datedebut = datedebut;
	}





	public LocalDate getDatedefin() {
		return datedefin;
	}





	public void setDatedefin(LocalDate datedefin) {
		this.datedefin = datedefin;
	}





	public Long getSyndic_id() {
		return syndic_id;
	}





	public void setSyndic_id(Long syndic_id) {
		this.syndic_id = syndic_id;
	}





	









	public String getEtat() {
		return etat;
	}





	public void setEtat(String etat) {
		this.etat = etat;
	}





	
    
    
    
    
    
}
