package com.example.demo.repositoris;


import com.example.demo.entities.Reclamation;


import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclamationRepositori extends JpaRepository<Reclamation, Long> {
	
}
