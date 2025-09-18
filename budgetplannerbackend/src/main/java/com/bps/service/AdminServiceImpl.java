package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.Admin;
import com.bps.model.User;
import com.bps.repository.AdminRepository;
import com.bps.repository.UserRepository;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public Admin checkAdminLogin(String username, String password) {
        return adminRepo.findByUsernameAndPassword(username, password);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public String deleteUser(int id) {
        userRepo.deleteById(id);
        return "User deleted successfully";
    }
}
