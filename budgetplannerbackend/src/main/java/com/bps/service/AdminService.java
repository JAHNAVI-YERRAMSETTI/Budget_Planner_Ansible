package com.bps.service;

import com.bps.model.Admin;
import java.util.List;

public interface AdminService {
    Admin saveAdmin(Admin admin);
    Admin findById(Long id);
    List<Admin> findAll();
    Admin findByUsername(String username);
}
