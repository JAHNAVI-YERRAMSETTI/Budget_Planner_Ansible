package com.bps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bps.model.Admin;
import com.bps.model.User;
import com.bps.repository.AdminRepository;
import com.bps.repository.UserRepository;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Admin checkAdminLogin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }

    @Override
    public List<User> displayUsers() {
        return userRepository.findAll();
    }

    @Override
    public String deleteUser(int uid) {
        Optional<User> u = userRepository.findById(uid);
        if (u.isPresent()) {
            userRepository.deleteById(uid);
            return "User Deleted Successfully";
        } else {
            return "User ID Not Found";
        }
    }

    @Override
    public long countUsers() {
        return userRepository.count();
    }
}
