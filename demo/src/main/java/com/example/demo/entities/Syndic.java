package com.example.demo.entities;



import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Entity;

import jakarta.persistence.OneToMany;




@Entity
public class Syndic  extends Personne{
	
	private String adresse ;
	private String  gard_type ;
	@OneToMany 
    private List<Tache> tache;
	
	 
	
	
    public Syndic() {
		super();
		this.setRole("Syndic");
		
	}


   
	

	public Syndic(int id, String email, String nom, String prenom, String password, String role) {
		super(id, email, nom, prenom, password, role);
		// TODO Auto-generated constructor stub
	}





	public Syndic(String adresse, String gard_type, List<Tache> tache) {
		super();
		this.adresse = adresse;
		this.gard_type = gard_type;
		this.tache = tache;
		
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		this.setPassword(passwordEncoder.encode(password));
	}





	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse , String statut_day ) {
		this.adresse = adresse;
		this.gard_type = statut_day;
	}




	public String getStatut_day() {
		return gard_type;
	}




	public void setStatut_day(String statut_day) {
		this.gard_type = statut_day;
	}


	public void setAdresse(String adresse2) {
		this.adresse = adresse2;
		
	}


}
