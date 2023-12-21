package com.example.demo.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Syndic;
import java.util.List;


public interface SyndicRepositori  extends JpaRepository<Syndic, Integer> {
	
public List<Syndic> findByNom(String nom);
//public List<Syndic>  findByStatut_day(String statut_day);
}
