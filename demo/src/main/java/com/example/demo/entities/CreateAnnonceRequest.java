package com.example.demo.entities;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class CreateAnnonceRequest {
    private String message;
    private MultipartFile file;
    private List<Long> selectedLocateurIds; // List of selected Locateur IDs

    // Constructors, getters, and setters

    public CreateAnnonceRequest() {
    }

    public CreateAnnonceRequest(String message, MultipartFile file, List<Long> selectedLocateurIds) {
        this.message = message;
        this.file = file;
        this.selectedLocateurIds = selectedLocateurIds;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public List<Long> getSelectedLocateurIds() {
        return selectedLocateurIds;
    }

    public void setSelectedLocateurIds(List<Long> selectedLocateurIds) {
        this.selectedLocateurIds = selectedLocateurIds;
    }
}
