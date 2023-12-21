package com.example.demo.repositoris;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
	
public List<Admin> findByNom(String nom);
}
