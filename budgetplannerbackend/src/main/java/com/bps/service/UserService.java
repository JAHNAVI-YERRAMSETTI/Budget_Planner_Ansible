package com.bps.service;

import com.bps.model.User;
import java.util.List;

public interface UserService {
    String registerUser(User user);
    User loginUser(String username, String password);
    List<User> getAllUsers();
}
