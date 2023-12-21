package com.example.demo.repositoris;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entities.Annonce;

public interface AnnonceRepositori extends JpaRepository<Annonce, Long>{

	Optional<Annonce> findById(Long id);

	void deleteById(Long id);

	@Query("SELECT a FROM Annonce a JOIN a.locateur l WHERE l.email = ?1")
    List<Annonce> findByLoc(String email);

	
	

}
