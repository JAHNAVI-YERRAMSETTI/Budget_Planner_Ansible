package com.bps.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Admin;
import com.bps.model.User;
import com.bps.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/checklogin")
    public ResponseEntity<?> checkLogin(@RequestBody Admin admin) {
        Admin a = adminService.checkAdminLogin(admin.getUsername(), admin.getPassword());
        if (a != null) return ResponseEntity.ok(a);
        else return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.displayUsers());
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam int uid) {
        try {
            String out = adminService.deleteUser(uid);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Delete failed: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        return ResponseEntity.ok(adminService.countUsers());
    }
}
