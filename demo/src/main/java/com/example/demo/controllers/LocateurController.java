package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


import com.example.demo.entities.Locateur;
import com.example.demo.entities.Personne;
import com.example.demo.repositoris.LocateurRepositori;
import com.example.demo.repositoris.PersonneRepository;

import java.util.List;

@RestController
@RequestMapping("/locateurs")
@CrossOrigin("http://localhost:3000")
public class LocateurController {
    @Autowired
    private LocateurRepositori locateurRepository;

    @Autowired
	private  PersonneRepository personneRepository; 
    
    @GetMapping("/count")
    public ResponseEntity<Long> getLocateurCount() {
        long count = locateurRepository.count();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Locateur>> getAllLocateurs() {
        List<Locateur> locateurs = locateurRepository.findAll();
        return new ResponseEntity<>(locateurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Locateur> getLocateurById(@PathVariable int id) {
        Locateur locateur = locateurRepository.findById(id).orElse(null);
        if (locateur != null) {
            return new ResponseEntity<>(locateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/byEmail/{email}")
    public ResponseEntity<Locateur> getLocateurByEmail(@PathVariable String email) {
        Locateur locateur = locateurRepository.findByEmail(email);
        if (locateur != null) {
            return new ResponseEntity<>(locateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//get locateur by email
    @PostMapping("/save")
    public ResponseEntity<Object> addLocateur(@RequestBody Locateur locateur) {

		// Check if an admin with the same email already exists in the database
        Personne existingPerson = personneRepository.findByEmail(locateur.getEmail());
        if (existingPerson != null) {
            return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);
        }
        // Check if an entity with the same email already exists
        Locateur existingLocateur = locateurRepository.findByEmail(locateur.getEmail());

        if (existingLocateur != null) {
            // An entity with this email already exists, return an error response
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // Hash the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        locateur.setPassword(passwordEncoder.encode(locateur.getPassword()));

        // Save the Locateur entity
        Locateur savedLocateur = locateurRepository.save(locateur);

        return new ResponseEntity<>(savedLocateur, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateLocateur(@PathVariable int id, @RequestBody Locateur updatedLocateur) {
        Locateur existingLocateur = locateurRepository.findById(id).orElse(null);
        if (existingLocateur != null) {
            if (!existingLocateur.getEmail().equals(updatedLocateur.getEmail())) {
                // Check if there is another locateur with the updated email
                Locateur locateurWithSameEmail = locateurRepository.findByEmail(updatedLocateur.getEmail());
                if (locateurWithSameEmail != null) {
                    return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);
                }
            }

            existingLocateur.setEmail(updatedLocateur.getEmail());
            existingLocateur.setNom(updatedLocateur.getNom());
            existingLocateur.setPrenom(updatedLocateur.getPrenom());
            existingLocateur.setTele(updatedLocateur.getTele());
            existingLocateur.setType(updatedLocateur.getType());
            existingLocateur.setDepense(updatedLocateur.getDepense());
            // Check if a new password is provided and update it
            if (updatedLocateur.getPassword() != null) {
                // Hash the new password using BCrypt
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                existingLocateur.setPassword(passwordEncoder.encode(updatedLocateur.getPassword()));
            }

            // Save the updated Locateur
            Locateur updated = locateurRepository.save(existingLocateur);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
                                                                  
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocateur(@PathVariable int id) {
        Locateur existingLocateur = locateurRepository.findById(id).orElse(null);
        if (existingLocateur != null) {
            locateurRepository.delete(existingLocateur);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/locateurs-not-located")
    public ResponseEntity<List<Locateur>> getLocateursNotLocated() {
        List<Locateur> locateursNotLocated = locateurRepository.findLocateursWithoutAppartements();
        return new ResponseEntity<>(locateursNotLocated, HttpStatus.OK);
    }

    
}
