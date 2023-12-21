package com.example.demo.repositoris;

import com.example.demo.entities.Tache;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TacheRepositori extends JpaRepository<Tache, Long> {

    

    @Query("SELECT t FROM Tache t WHERE t.syndic_id = ?1")
    List<Tache> findBySyndicIdUsingQuery(Long syndic_id);

}
