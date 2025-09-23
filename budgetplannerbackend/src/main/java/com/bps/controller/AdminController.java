package com.bps.controller;

import com.bps.model.Admin;
import com.bps.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
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
