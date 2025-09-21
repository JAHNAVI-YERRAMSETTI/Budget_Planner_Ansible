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

    // ✅ Login endpoint (returns admin JSON without password)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        Admin existingAdmin = adminService.findByUsername(admin.getUsername());

        if (existingAdmin != null && existingAdmin.getPassword().equals(admin.getPassword())) {
            // Don’t expose password to frontend
            existingAdmin.setPassword(null);
            return ResponseEntity.ok(existingAdmin);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
