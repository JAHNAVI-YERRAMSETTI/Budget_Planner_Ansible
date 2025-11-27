package com.bps.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bps.model.Admin;
import com.bps.service.AdminService;

@RestController
@RequestMapping("/admins")
@CrossOrigin(origins = "*") // allow frontend to call backend
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Register new admin
    @PostMapping
    public Admin saveAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    // Get admin by ID
    @GetMapping("/{id}")
    public Admin getAdmin(@PathVariable Long id) {
        return adminService.findById(id);
    }

    // Get all admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.findAll();
    }

    // Login endpoint with input trimming and logging
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        String username = admin.getUsername() != null ? admin.getUsername().trim() : null;
        String password = admin.getPassword() != null ? admin.getPassword().trim() : null;

        System.out.println("Login attempt user: '" + username + "', password: '" + password + "'");

        Admin existingAdmin = adminService.findByUsername(username);
        System.out.println("Existing admin from DB: " + existingAdmin);

        if (existingAdmin != null && password != null && password.equals(existingAdmin.getPassword())) {
            existingAdmin.setPassword(null); // Don't return password
            return ResponseEntity.ok(existingAdmin);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
