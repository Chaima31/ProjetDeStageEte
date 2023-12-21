package com.example.demo.controllers;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entities.Admin;
import com.example.demo.entities.Personne;
import com.example.demo.repositoris.AdminRepository; // Replace with your actual repository class for Admin
import com.example.demo.repositoris.PersonneRepository;

import java.util.List;

@RestController
@RequestMapping("/admins")
@CrossOrigin("http://localhost:3000")
public class AdminController {

    private final AdminRepository adminRepository; // Replace with your actual repository class for Admin
    private final PersonneRepository personneRepository; 
   
    
    public AdminController(AdminRepository adminRepository, PersonneRepository personneRepository) {
        this.adminRepository = adminRepository;
		this.personneRepository = personneRepository;
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countAdmins() {
        long count = adminRepository.count();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminRepository.findAll();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable int id) {
        Admin admin = adminRepository.findById(id).orElse(null);
        if (admin != null) {
            return new ResponseEntity<>(admin, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
        // Check if an admin with the same email already exists in the database
        Personne existingPerson = personneRepository.findByEmail(admin.getEmail());
        if (existingPerson != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // You can pass the plain text password here
        Admin savedAdmin = adminRepository.save(admin);

        // If you want to set a default role for Admin, you can do it here
        savedAdmin.setRole("Admin");

        // Hash the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        savedAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));

        // Save the updated Admin entity with the encrypted password
        savedAdmin = adminRepository.save(savedAdmin);

        return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
    }

    


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateAdmin(@PathVariable int id, @RequestBody Admin updatedAdmin) {
    	
    	 Personne existingPerson = personneRepository.findByEmail(updatedAdmin.getEmail());
         if (existingPerson != null) {
             return new ResponseEntity<Object>("Email already exists", HttpStatus.NOT_ACCEPTABLE);
         }
         else {
        Admin existingAdmin = adminRepository.findById(id).orElse(null);
        // Check if an admin with the same email already exists in the database
       
      
        if (existingAdmin != null) {
        	
            existingAdmin.setAdresse(updatedAdmin.getAdresse());
            existingAdmin.setNom(updatedAdmin.getNom());
            existingAdmin.setEmail(updatedAdmin.getEmail());
            existingAdmin.setPrenom(updatedAdmin.getPrenom());
            
            // Check if a new password is provided and update it
            if (updatedAdmin.getPassword() != null) {
                // Hash the new password using BCrypt
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                existingAdmin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
            }

            Admin updated = adminRepository.save(existingAdmin);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
         }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable int id) {
        Admin existingAdmin = adminRepository.findById(id).orElse(null);
        if (existingAdmin != null) {
            adminRepository.delete(existingAdmin);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
