package com.bps.service;

import java.util.List;

import com.bps.model.Admin;
import com.bps.model.User;

public interface AdminService {

    public Admin checkAdminLogin(String username, String password);

    public List<User> displayUsers();
    public String deleteUser(int uid); 

 
    public long countUsers();
}
