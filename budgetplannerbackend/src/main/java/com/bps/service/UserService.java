package com.bps.service;

import com.bps.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Optional<User> findById(Long id);
    List<User> findAll();
    Optional<User> findByUsername(String username);
    User authenticateUser(String username, String password);
    boolean existsByUsername(String username);
}