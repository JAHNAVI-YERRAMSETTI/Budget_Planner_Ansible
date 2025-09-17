package com.bps.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bps.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByUsernameAndPassword(String username, String password);

    @Query("SELECT u FROM User u WHERE u.gender = ?1")
    public List<User> findByGender(String gender);

    @Query("SELECT COUNT(u) FROM User u")
    public long userCount();

  


     @Modifying
     @Transactional
     @Query("DELETE FROM User u WHERE u.username = ?1")
     public int deleteByUsername(String username);
}
