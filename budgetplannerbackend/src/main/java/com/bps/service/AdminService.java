package com.bps.service;

import com.bps.model.Admin;
import com.bps.model.User;
import java.util.List;

public interface AdminService {
    Admin checkAdminLogin(String username, String password);
    List<User> getAllUsers();
    String deleteUser(int id);
    // Add more management functions if needed
}
