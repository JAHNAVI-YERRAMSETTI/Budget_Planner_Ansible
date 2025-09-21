package com.bps;

import com.bps.model.Category;
import com.bps.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(new Category("Food"));
            categoryRepository.save(new Category("Transport"));
            categoryRepository.save(new Category("Entertainment"));
            categoryRepository.save(new Category("Utilities"));
            categoryRepository.save(new Category("Rent"));
            categoryRepository.save(new Category("Shopping"));
            categoryRepository.save(new Category("Health"));
            categoryRepository.save(new Category("Education"));
            categoryRepository.save(new Category("Other"));
        }
    }
}