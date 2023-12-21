package com.example.demo.repositoris;



import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Proprietaire;

public interface ProprietaireRepositori extends JpaRepository<Proprietaire, Integer> {

	public Proprietaire findById(int proprietaireId);

	public Proprietaire findByEmail(String email);
	

}
