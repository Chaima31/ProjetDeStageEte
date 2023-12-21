package com.example.demo.repositoris;



import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.*;

public interface PersonneRepository  extends JpaRepository<Personne, Integer> {
    Personne findByEmailAndPassword(String email, String password);

	Personne findByEmail(String email);
}
