package com.example.demo.repositoris;


import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Appartement;
import com.example.demo.entities.Locateur;
import com.example.demo.entities.Meuble;
import com.example.demo.entities.Proprietaire;



public interface AppartementRepositori extends JpaRepository<Appartement, Integer> {
	
	public  List<Appartement> findByMeubleId(int meubleId);
    public  Appartement findByMeuble_Id(int meubleId);
	public List<Appartement> getById(Appartement meuble);
	public Appartement findById(Long appartementId);
	List<Appartement> findByMeuble(Meuble meuble);
	public List<Appartement> findByProprietaire(Proprietaire proprietaire);
	public List<Appartement> findByLocateur(Locateur locateur);
	public static void deleteById(Long id) {
		// TODO Auto-generated method stub
		
	}
}
