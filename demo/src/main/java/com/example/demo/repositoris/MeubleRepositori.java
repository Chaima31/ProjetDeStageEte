package com.example.demo.repositoris;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Meuble;

public interface MeubleRepositori extends JpaRepository<Meuble, Integer> {

	Optional<Meuble> getById(int id);

	
	
 
}
