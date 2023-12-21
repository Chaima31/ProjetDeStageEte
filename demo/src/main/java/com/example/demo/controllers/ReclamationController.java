package com.example.demo.controllers;


import com.example.demo.entities.Reclamation;
import com.example.demo.repositoris.ReclamationRepositori;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/reclamations")
@CrossOrigin("http://localhost:3000")
public class ReclamationController {
	 private Set<String> sentMessageIds = new HashSet<>();
	    @Autowired
	    private SimpMessagingTemplate messagingTemplate;
	   private final ReclamationRepositori reclamationRepositori;
	   
	    
    public ReclamationController(ReclamationRepositori reclamationRepositori) {
        this.reclamationRepositori = reclamationRepositori;
       
    }


    // Get all reclamations
    @GetMapping("/all")
    public List<Reclamation> getAllReclamations() {
        return reclamationRepositori.findAll();
    }

    // Get a single reclamation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getReclamationById(@PathVariable Long id) {
        Reclamation reclamation = reclamationRepositori.findById(id).orElse(null);
        if (reclamation != null) {
            return ResponseEntity.ok(reclamation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
//    // Save a new reclamation
//    @PostMapping("/save")
//    public ResponseEntity<Reclamation> saveReclamation(@RequestBody Reclamation newReclamation) {
//    	
//    	newReclamation.setLocateur(newReclamation.getLocateur());
//        Reclamation savedReclamation = reclamationRepositori.save(newReclamation);
//        return ResponseEntity.ok(savedReclamation);
//   
//    	 
//    }

    @PostMapping("/save")
    public ResponseEntity<Reclamation> saveReclamation(@RequestBody Reclamation newReclamation) {
        // You can validate and process the newReclamation object here
        // For example, set the Locateur for the reclamation
        
        // Save the reclamation to the database using your reclamation repository
    	newReclamation.setLocateur(newReclamation.getLocateur());
        Reclamation savedReclamation = reclamationRepositori.save(newReclamation);
        
        // Send the announcement to the WebSocket topic only if it's not a duplicate
        if (!sentMessageIds.contains(savedReclamation.getId().toString())) {
            messagingTemplate.convertAndSend("/topic/reclamations", savedReclamation);
            sentMessageIds.add(savedReclamation.getId().toString());
        }
        // Return the saved reclamation with an HTTP OK status
        return ResponseEntity.ok(savedReclamation);
    }
    
        
            

    // Update an existing reclamation
    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> updateReclamation(@PathVariable Long id, @RequestBody Reclamation updatedReclamation) {
        Reclamation reclamation = reclamationRepositori.findById(id).orElse(null);
        if (reclamation != null) {
            reclamation.setMessage(updatedReclamation.getMessage());
            
            reclamationRepositori.save(reclamation);
            return ResponseEntity.ok(reclamation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a reclamation by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable Long id) {
        Reclamation reclamation = reclamationRepositori.findById(id).orElse(null);
        if (reclamation != null) {
            reclamationRepositori.delete(reclamation);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
