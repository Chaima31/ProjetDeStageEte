package com.example.demo.controllers;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Personne;

import com.example.demo.repositoris.PersonneRepository;

@RestController
@RequestMapping("/Personnes")
@CrossOrigin("http://localhost:3000")
public class PersonneController {
	
	
	@Autowired
	    private PersonneRepository personneRepository;

	@Autowired
    private EmailService emailServes;
	    @GetMapping("/connect/{email}/{password}")
	    public String verifyEmailAndPassword(@PathVariable String email, @PathVariable String password) {
	        // Retrieve the user by email
	        Personne personne = personneRepository.findByEmail(email);

	        // Check if the user exists and the provided password matches the stored hashed password
	        if (personne != null && isPasswordMatches(password, personne.getPassword())) {
	            return personne.getRole();
	        }
	        return null;
	    }

	    private boolean isPasswordMatches(String plainPassword, String hashedPassword) {
	        // Use BCrypt to verify if the plain text password matches the hashed password
	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	        return passwordEncoder.matches(plainPassword, hashedPassword);
	    }
	 
	 // New API endpoint to get all persons
	    @GetMapping("/all")
	    public List<Personne> getAllPersonnes() {
	        // Retrieve all persons from the repository
	        List<Personne> personnes = personneRepository.findAll();
	        return personnes;
	    }
	    
	    @PostMapping("/resetPassword/{email}")
	    public String resetPassword(@PathVariable String email) {
	        // Retrieve the user by email
	        Personne personne = personneRepository.findByEmail(email);

	        if (personne != null) {
	            // Generate a random password (you can customize this logic)
	            String newPassword = generateRandomPassword();

	            // Hash the password using BCrypt
	            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	            String hashedPassword = passwordEncoder.encode(newPassword);

	            // Update the user's password in the database
	            personne.setPassword(hashedPassword);
	            personneRepository.save(personne);

	            // Send the new password to the user via email
	            emailServes.sendPasswordResetEmail(personne.getEmail(), newPassword);

	            return "Password reset successful. Check your email for the new password.";
	        } else {
	            return "Email not found.";
	        }
	    }

	    private String generateRandomPassword() {
	        // Define characters to use in the random password
	        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

	        // Define the length of the password
	        int length = 10;

	        StringBuilder newPassword = new StringBuilder();

	        // Generate a random password using the defined characters
	        Random random = new Random();
	        for (int i = 0; i < length; i++) {
	            int index = random.nextInt(characters.length());
	            newPassword.append(characters.charAt(index));
	        }

	        return newPassword.toString();
	    }
	    
	    
	 
}
