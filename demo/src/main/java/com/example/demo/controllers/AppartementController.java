package com.example.demo.controllers;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Appartement;
import com.example.demo.entities.Locateur;
import com.example.demo.entities.Meuble;
import com.example.demo.entities.Paiement;
import com.example.demo.repositoris.AppartementRepositori;
import com.example.demo.repositoris.LocateurRepositori;
import com.example.demo.repositoris.MeubleRepositori;
import com.example.demo.repositoris.PaiementRepositori;



@RestController
@RequestMapping("/appartements")
@CrossOrigin("http://localhost:3000")
public class AppartementController {

    @Autowired
    private AppartementRepositori appartementRepository;
  
    @Autowired
    private MeubleRepositori meubleRepositori; 
    @Autowired
    private LocateurRepositori locateurRepositori; 
      
    @Autowired
    private PaiementRepositori paiementRepository; // Inject PaiementRepositori
    
    @GetMapping("/count")
    public ResponseEntity<Long> countAppartements() {
        long count = appartementRepository.count();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    


    
 // Get an Appartement by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appartement> getAppartementById(@PathVariable int id) {
        Appartement appartement = appartementRepository.findById(id).orElse(null);
        if (appartement != null) {
            return new ResponseEntity<>(appartement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // List all Appartements
    @GetMapping("/all")
    public ResponseEntity<List<Appartement>> listAllAppartements() {
        List<Appartement> appartements = appartementRepository.findAll();
        return new ResponseEntity<>(appartements, HttpStatus.OK);
    }
    
    
    // Get Appartements by Meuble
    @GetMapping("/by-meuble/{meubleId}")
    public ResponseEntity<List<Appartement>> getAppartementsByMeuble(@PathVariable int meubleId) {
        Meuble meuble = meubleRepositori.findById(meubleId).orElse(null);
        
        if (meuble != null) {
            List<Appartement> appartements = appartementRepository.findByMeuble(meuble);
            return new ResponseEntity<>(appartements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    
 // Get Appartements by Locateur
    @GetMapping("/by-locateur/{locateurId}")
    public ResponseEntity<List<Appartement>> getAppartementsByLocateur(@PathVariable int locateurId) {
        Locateur locateur = locateurRepositori.findById(locateurId).orElse(null);
        
        if (locateur != null) {
            List<Appartement> appartements = appartementRepository.findByLocateur(locateur);
            return new ResponseEntity<>(appartements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    
    
    // Save or Update an Appartement
    @PostMapping("/save")
    public ResponseEntity<Appartement> saveOrUpdateAppartement(@RequestBody Appartement appartement) {
        Appartement savedAppartement = appartementRepository.save(appartement);
        return new ResponseEntity<>(savedAppartement, HttpStatus.CREATED);
    }


 
    
    @PutMapping("/{id}")
    public ResponseEntity<Appartement> updateAppartement(@PathVariable int id, @RequestBody Appartement updatedAppartement) {
        Appartement existingAppartement = appartementRepository.findById(id).orElse(null);
        if (existingAppartement != null) {
            existingAppartement.setNumero(updatedAppartement.getNumero());
            existingAppartement.setProprietaire(updatedAppartement.getProprietaire());
            existingAppartement.setLocateur(updatedAppartement.getLocateur());
            existingAppartement.setMeuble(updatedAppartement.getMeuble());
            // Set other properties if needed

            Appartement updated = appartementRepository.save(existingAppartement);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




	public static void deleteById(Long id) {
		// TODO Auto-generated method stub
		
	}

    
}
