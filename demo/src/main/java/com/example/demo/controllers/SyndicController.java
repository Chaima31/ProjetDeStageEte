package com.example.demo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Personne;
import com.example.demo.entities.Syndic;
import com.example.demo.repositoris.PersonneRepository;
import com.example.demo.repositoris.SyndicRepositori;

import java.util.List;

@RestController
@RequestMapping("/syndics")
@CrossOrigin("http://localhost:3000")
public class SyndicController {

    private final SyndicRepositori syndicRepository;
    private final PersonneRepository personneRepository; 
 
    public SyndicController(SyndicRepositori syndicRepository, PersonneRepository personneRepository) {
        this.syndicRepository = syndicRepository;
		this.personneRepository = personneRepository;
    }
    
    
    // Count all Syndics
    @GetMapping("/count")
    public ResponseEntity<Long> countSyndics() {
        long count = syndicRepository.count();
        return ResponseEntity.ok(count);
    }
    

    @GetMapping("/all")
    public ResponseEntity<List<Syndic>> getAllSyndics() {
        List<Syndic> syndics = syndicRepository.findAll();
        return new ResponseEntity<>(syndics, HttpStatus.OK);
    }
    


    @GetMapping("/{id}")
    public ResponseEntity<Syndic> getSyndicById(@PathVariable int id) {
        Syndic syndic = syndicRepository.findById(id).orElse(null);
        if (syndic != null) {
            return new ResponseEntity<>(syndic, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

    @PostMapping("/save")
    public ResponseEntity<Object> addSyndic(@RequestBody Syndic syndic) {
    	
    	
		// Check if an admin with the same email already exists in the database
        Personne existingPerson = personneRepository.findByEmail(syndic.getEmail());
        if (existingPerson != null) {
            return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // You can pass the plain text password here
        Syndic savedSyndic = syndicRepository.save(syndic);
        
        // If you want to set a default role for Syndic, you can do it here
        savedSyndic.setRole("Syndic");
        
        // Hash the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        savedSyndic.setPassword(passwordEncoder.encode(syndic.getPassword()));
        
        // Save the updated Syndic entity with the encrypted password
        savedSyndic = syndicRepository.save(savedSyndic);
        
        return new ResponseEntity<>(savedSyndic, HttpStatus.CREATED);
    }
    
    
    

    
    	
    	// Check if an admin with the same email already exists in the database
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSyndic(@PathVariable int id, @RequestBody Syndic updatedSyndic) {
        Syndic existingSyndic = syndicRepository.findById(id).orElse(null);

        if (existingSyndic != null) {
            // Copy the existing email to the updated Syndic
            updatedSyndic.setEmail(existingSyndic.getEmail());

            // Update the other fields
            updatedSyndic.setAdresse(existingSyndic.getAdresse());
            updatedSyndic.setStatut_day(existingSyndic.getStatut_day());
            updatedSyndic.setNom(existingSyndic.getNom());
            updatedSyndic.setPrenom(existingSyndic.getPrenom());

            // Check if a new password is provided and update it
            if (updatedSyndic.getPassword() != null) {
                // Hash the new password using BCrypt
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                updatedSyndic.setPassword(passwordEncoder.encode(updatedSyndic.getPassword()));
            }

            Syndic updated = syndicRepository.save(updatedSyndic);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSyndic(@PathVariable int id) {
        Syndic existingSyndic = syndicRepository.findById(id).orElse(null);
        if (existingSyndic != null) {
            syndicRepository.delete(existingSyndic);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

