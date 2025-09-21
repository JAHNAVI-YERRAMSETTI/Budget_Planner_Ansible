package com.bps.service;

import com.bps.model.Alert;
import com.bps.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertServiceImpl implements AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public Alert saveAlert(Alert alert) {
        if (alert.getUser() == null) {
            throw new IllegalArgumentException("User is required for Alert");
        }
        if (alert.getTimestamp() == null) {
            alert.setTimestamp(LocalDateTime.now());
        }
        return alertRepository.save(alert);
    }

    @Override
    public Alert findById(Long id) {
        return alertRepository.findById(id).orElse(null);
    }

    @Override
    public List<Alert> findAll() {
        return alertRepository.findAll();
    }

    @Override
    public List<Alert> findByUserId(Long userId) {
        return alertRepository.findByUser_Id(userId);
    }

    @Override
    public Alert updateAlert(Alert alert) {
        if (alert.getId() == null || alert.getUser() == null) {
            throw new IllegalArgumentException("ID and User are required for updating Alert");
        }
        return alertRepository.save(alert);
    }

    @Override
    public void deleteById(Long id) {
        alertRepository.deleteById(id);
    }
}