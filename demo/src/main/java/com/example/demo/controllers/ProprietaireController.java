package com.example.demo.controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Appartement;
import com.example.demo.entities.Personne;
import com.example.demo.entities.Proprietaire;
import com.example.demo.repositoris.AppartementRepositori;
import com.example.demo.repositoris.PersonneRepository;
import com.example.demo.repositoris.ProprietaireRepositori;

import java.util.List;

@RestController
@RequestMapping("/proprietaires")
@CrossOrigin("http://localhost:3000")
public class ProprietaireController {
	@Autowired
    private  ProprietaireRepositori proprietaireRepository;
	@Autowired
	private  PersonneRepository personneRepository; 
    
	@Autowired
    private  AppartementRepositori appartementRepository;


    @GetMapping("/by-email/{email}")
    public ResponseEntity<Proprietaire> getProprietaireByEmail(@PathVariable String email) {
        Proprietaire proprietaire = proprietaireRepository.findByEmail(email);
        if (proprietaire != null) {
            return new ResponseEntity<>(proprietaire, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
 // Get Appartements by Proprietaire ID
    @GetMapping("/by-proprietaire/{proprietaireId}")
    public ResponseEntity<List<Appartement>> getAppartementsByProprietaire(@PathVariable int proprietaireId) {
        Proprietaire proprietaire = proprietaireRepository.findById(proprietaireId).orElse(null);

        if (proprietaire != null) {
            List<Appartement> appartements = appartementRepository.findByProprietaire(proprietaire);
            return new ResponseEntity<>(appartements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    
    // Count all Proprietaires
    @GetMapping("/count")
    public ResponseEntity<Long> countProprietaires() {
        long count = proprietaireRepository.count();
        return ResponseEntity.ok(count);
    }
    
    
    @GetMapping("/all")
    public ResponseEntity<List<Proprietaire>> getAllProprietaires() {
        List<Proprietaire> proprietaires = proprietaireRepository.findAll();
        return new ResponseEntity<>(proprietaires, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proprietaire> getProprietaireById(@PathVariable int id) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElse(null);
        if (proprietaire != null) {
            return new ResponseEntity<>(proprietaire, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/save")
    public ResponseEntity<Object> addProprietaire(@RequestBody Proprietaire proprietaire) {
    	
    	
		// Check if an admin with the same email already exists in the database
        Personne existingPerson = personneRepository.findByEmail(proprietaire.getEmail());
        if (existingPerson != null) {
            return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);
        }
        // Check if an entity with the same email already exists
        Proprietaire existingProprietaire = proprietaireRepository.findByEmail(proprietaire.getEmail());

        if (existingProprietaire != null) {
            // An entity with this email already exists, return an error response
        	return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);

        }

        // Hash the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        proprietaire.setPassword(passwordEncoder.encode(proprietaire.getPassword()));

        // Save the Proprietaire entity
        Proprietaire savedProprietaire = proprietaireRepository.save(proprietaire);

        return new ResponseEntity<>(savedProprietaire, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProprietaire(@PathVariable int id, @RequestBody Proprietaire updatedProprietaire) {
    	
    	// Check if an admin with the same email already exists in the database
        Personne existingPerson = personneRepository.findByEmail(updatedProprietaire.getEmail());
        if (existingPerson != null) {
            return new ResponseEntity<Object>("Email already exists", HttpStatus.BAD_REQUEST);
        }	
        else {
        Proprietaire existingProprietaire = proprietaireRepository.findById(id).orElse(null);
        if (existingProprietaire != null) {
            existingProprietaire.setEmail(updatedProprietaire.getEmail());
            existingProprietaire.setNom(updatedProprietaire.getNom());
           
            existingProprietaire.setPrenom(updatedProprietaire.getPrenom());
           
           
            existingProprietaire.setTele(updatedProprietaire.getTele());
           

            // Check if a new password is provided and update it
            if (updatedProprietaire.getPassword() != null) {
                // Hash the new password using BCrypt
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                existingProprietaire.setPassword(passwordEncoder.encode(updatedProprietaire.getPassword()));
            }

            // Save the updated Proprietaire
            Proprietaire updated = proprietaireRepository.save(existingProprietaire);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProprietaire(@PathVariable int id) {
        Proprietaire existingProprietaire = proprietaireRepository.findById(id).orElse(null);
        if (existingProprietaire != null) {
            proprietaireRepository.delete(existingProprietaire);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
