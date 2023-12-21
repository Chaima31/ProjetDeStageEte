package com.example.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Paiement;

import com.example.demo.repositoris.PaiementRepositori;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/paiements")
@CrossOrigin("http://localhost:3000")
public class PaiementController {


   
    @Autowired
    private PaiementRepositori paiementRepository;
    
    // Count all Paiements
    @GetMapping("/count")
    public ResponseEntity<Long> countPaiements() {
        long count = paiementRepository.count();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Paiement>> getAllPaiements() {
        List<Paiement> paiements = paiementRepository.findAll();
        return new ResponseEntity<>(paiements, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable Long id) {
        Optional<Paiement> paiementOptional = paiementRepository.findById(id);
        
        if (paiementOptional.isPresent()) {
            Paiement paiement = paiementOptional.get();
            return new ResponseEntity<>(paiement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
  //get list paiement by appartement 
    @GetMapping("/by-appartement/{appartementId}")
    public ResponseEntity<List<Paiement>> getPaiementsByAppartement(@PathVariable int appartementId) {
        List<Paiement> paiements = paiementRepository.findByAppartement_Id(appartementId);
        
        if (!paiements.isEmpty()) {
            return new ResponseEntity<>(paiements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    
    
    @PostMapping("/save")
    public ResponseEntity<Paiement> addPaiement(@RequestBody Paiement paiement) {
        try {
            Paiement savedPaiement = paiementRepository.save(paiement);
            return new ResponseEntity<>(savedPaiement, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paiement> updatePaiement(@PathVariable Long id, @RequestBody Paiement paiement) {
        Optional<Paiement> existingPaiementOptional = paiementRepository.findById(id);
        
        if (existingPaiementOptional.isPresent()) {
            Paiement existingPaiement = existingPaiementOptional.get();
            existingPaiement.setMontant(paiement.getMontant());
            existingPaiement.setTrimestre(paiement.getTrimestre());
            
            existingPaiement.setAppartement(paiement.getAppartement());

            Paiement updatedPaiement = paiementRepository.save(existingPaiement);
            return new ResponseEntity<>(updatedPaiement, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePaiement(@PathVariable Long id) {
        try {
            paiementRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
