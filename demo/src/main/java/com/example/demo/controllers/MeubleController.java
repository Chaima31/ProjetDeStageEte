package com.example.demo.controllers;

import com.example.demo.entities.Appartement;
import com.example.demo.entities.Meuble;
import com.example.demo.repositoris.MeubleRepositori;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/meubles")
@CrossOrigin("http://localhost:3000")
public class MeubleController {

    private final MeubleRepositori meubleRepository;

    public MeubleController(MeubleRepositori meubleRepository) {
        this.meubleRepository = meubleRepository;
    }

 // Count all Meubles
    @GetMapping("/count")
    public ResponseEntity<Long> countMeubles() {
        long count = meubleRepository.count();
        return ResponseEntity.ok(count);
    }
    
    
    // Get all meubles
    @GetMapping("/all")
    public List<Meuble> getAllMeubles() {
        return meubleRepository.findAll();
    }

    // Get meuble by ID
    @GetMapping("/{id}")
    public ResponseEntity<Meuble> getMeubleById(@PathVariable Long id) {
        Optional<Meuble> optionalMeuble = meubleRepository.findById(null);
        return optionalMeuble.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    

    // Get a list of Appartements by Meuble ID
    @GetMapping("/{meubleId}/appartements")
    public ResponseEntity<List<Appartement>> getAppartementsByMeuble(@PathVariable int meubleId) {
        Optional<Meuble> optionalMeuble = meubleRepository.findById(meubleId);
        if (optionalMeuble.isPresent()) {
            Meuble meuble = optionalMeuble.get();
            List<Appartement> appartements = meuble.getAppartement();
            return new ResponseEntity<>(appartements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

    // Save a new meuble
    @PostMapping("/save")
    public ResponseEntity<Meuble> saveMeuble(@RequestBody Meuble meuble) {
        Meuble savedMeuble = meubleRepository.save(meuble);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMeuble);
    }

    // Update an existing meuble
    @PutMapping("/{id}")
    public ResponseEntity<Meuble> updateMeuble(@PathVariable int id, @RequestBody Meuble meuble) {
        Optional<Meuble> optionalMeuble = meubleRepository.findById(id);
        if (optionalMeuble.isPresent()) {
            meuble.setId(id);
            Meuble updatedMeuble = meubleRepository.save(meuble);
            return ResponseEntity.ok(updatedMeuble);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMeuble(@PathVariable int id)  {
        Optional<Meuble> optionalMeuble = meubleRepository.findById(id);
        if (optionalMeuble.isPresent()) {
            meubleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
