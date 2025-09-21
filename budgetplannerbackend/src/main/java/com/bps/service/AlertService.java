package com.bps.service;

import com.bps.model.Alert;
import java.util.List;

public interface AlertService {
    Alert saveAlert(Alert alert);
    Alert findById(Long id);
    List<Alert> findAll();
    List<Alert> findByUserId(Long userId);
    Alert updateAlert(Alert alert);
    void deleteById(Long id);
}