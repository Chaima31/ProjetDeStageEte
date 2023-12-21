package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.entities.Annonce;
import com.example.demo.entities.Locateur;
import com.example.demo.repositoris.AnnonceRepositori;
import com.example.demo.repositoris.LocateurRepositori;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/annonces")
@CrossOrigin("http://localhost:3000")
public class AnnonceController {
	
    @Autowired
    private AnnonceRepositori annonceRepositori;
    
    @Autowired
    private LocateurRepositori locateurRepositori;
    
   

    private Set<String> sentMessageIds = new HashSet<>();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Value("${file.upload.dir}") // Inject the file upload directory from properties
    private String fileUploadDir;

    @PostMapping("/save")
    public ResponseEntity<Annonce> createAnnonceWithFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("message") String message,
            @RequestParam("locateurIds") List<Integer> locateurIds) {
        try {
            // Create the directory if it doesn't exist
            File directory = new File(fileUploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save the uploaded file to the specified directory
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = Paths.get(fileUploadDir, fileName).toString();
            file.transferTo(new File(filePath));

            // Create the Annonce object with the file URL
            Annonce annonce = new Annonce();
            annonce.setMessage(message);
            annonce.setFileUrl(fileUploadDir + fileName);
            annonce.setFilenam( fileName);// Assuming '/uploads' is the public URL path to access uploaded files
            // You can customize this path as needed.

            // Load the locateurs based on the provided locateur IDs and set them in the Annonce
            List<Locateur> locateurs = locateurRepositori.findAllById(locateurIds); // You need to implement this method
            annonce.setLocateur(locateurs);

            // Save the Annonce to the database
            Annonce createdAnnonce = annonceRepositori.save(annonce);

            // Send the announcement to the WebSocket topic only if it's not a duplicate
            if (!sentMessageIds.contains(createdAnnonce.getId().toString())) {
                messagingTemplate.convertAndSend("/topic/announcements", createdAnnonce);
                sentMessageIds.add(createdAnnonce.getId().toString());
            }

            return new ResponseEntity<>(createdAnnonce, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new API endpoint to download the file associated with an Annonce by its ID
    @GetMapping("/download/{id}")
    public ResponseEntity<FileSystemResource> serveFile(@PathVariable Long id) {
        Optional<Annonce> annonceOptional = annonceRepositori.findById(id);

        if (annonceOptional.isPresent()) {
            Annonce annonce = annonceOptional.get();
            String filePath = annonce.getFileUrl(); // Assuming this contains the relative file path

            // Resolve the absolute file path
            Path fileAbsolutePath = Paths.get("", filePath);

            FileSystemResource fileResource = new FileSystemResource(fileAbsolutePath.toFile());

			if (fileResource.exists()) {
			    HttpHeaders headers = new HttpHeaders();
			    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

			    return new ResponseEntity<>(fileResource, headers, HttpStatus.OK);
			}
        }

        return ResponseEntity.notFound().build();
    }
    
    

    
    // Get all Annonces
    @GetMapping("/all")
    public ResponseEntity<List<Annonce>> getAllAnnonces() {
        List<Annonce> annonces = annonceRepositori.findAll(); // Use the repository to find all
        return new ResponseEntity<>(annonces, HttpStatus.OK);
    }

    // Get one Annonce by ID
    @GetMapping("/{id}")
    public ResponseEntity<Annonce> getAnnonceById(@PathVariable Long id) {
        Optional<Annonce> annonce = annonceRepositori.findById(id); // Use the repository to find by ID

        if (annonce.isPresent()) {
            return new ResponseEntity<>(annonce.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/by-locateur/{email}")
    public ResponseEntity<List<Annonce>> getAnnoncesByLocateur(@PathVariable String email) {
        List<Annonce> annonces = annonceRepositori.findByLoc(email);
        return new ResponseEntity<>(annonces, HttpStatus.OK);
    }

    // Update an existing Annonce
    @PutMapping("/{id}")
    public ResponseEntity<Annonce> updateAnnonce(@PathVariable Long id, @RequestBody Annonce updatedAnnonce) {
        Optional<Annonce> existingAnnonce = annonceRepositori.findById(id); // Use the repository to find by ID

        if (existingAnnonce.isPresent()) {
            updatedAnnonce.setId(id);
            Annonce savedAnnonce = annonceRepositori.save(updatedAnnonce); // Use the repository to update
            return new ResponseEntity<>(savedAnnonce, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete an Annonce by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnonce(@PathVariable Long id) {
        Optional<Annonce> existingAnnonce = annonceRepositori.findById(id); // Use the repository to find by ID

        if (existingAnnonce.isPresent()) {
        	
            annonceRepositori.deleteById(id); // Use the repository to delete by ID
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

   
}
