package com.example.demo.controllers;

import com.example.demo.entities.Tache;
import com.example.demo.repositoris.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/taches")
@CrossOrigin("http://localhost:3000")
public class TacheController {

    private final TacheRepositori tacheRepository;

    public TacheController(TacheRepositori tacheRepository) {
        this.tacheRepository = tacheRepository;
    }
    
    @GetMapping("/count")
    public long getTachesCount() {
        return tacheRepository.count();
    }
    
    //get list tach by syndic id 
    @GetMapping("/bySyndic/{syndic_id}")
    public List<Tache> getTachesBySyndicId(@PathVariable Long syndic_id) {
        return tacheRepository.findBySyndicIdUsingQuery(syndic_id);
    }

    
    
    @GetMapping("/all")
    public List<Tache> getAllTaches() {
        return tacheRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Tache> getTacheById(@PathVariable Long id) {
        return tacheRepository.findById(id);
    }

    @PostMapping("/save")
    public Tache createTache(@RequestBody Tache tache) {
        return tacheRepository.save(tache);
    }

    @PutMapping("/{id}")
    public Tache updateTache(@PathVariable Long id, @RequestBody Tache updatedTache) {
        Optional<Tache> existingTacheOptional = tacheRepository.findById(id);
        
        if (existingTacheOptional.isPresent()) {
            Tache existingTache = existingTacheOptional.get();
            
            // Update the 'etat' field if it has changed
            if (!existingTache.getEtat().equals(updatedTache.getEtat())) {
                existingTache.setEtat(updatedTache.getEtat());
            }
            
            // Update other fields unconditionally
            existingTache.setDescription(updatedTache.getDescription());
            existingTache.setDatedebut(updatedTache.getDatedebut());
            existingTache.setDatedefin(updatedTache.getDatedefin());
            existingTache.setSyndic_id(updatedTache.getSyndic_id());
            
            return tacheRepository.save(existingTache);
        } else {
            // Handle the case where the Tache with the given ID does not exist
            // You can throw an exception or return an appropriate response here
            // For simplicity, I'm returning null in this example.
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteTache(@PathVariable Long id) {
        tacheRepository.deleteById(id);
    }
}