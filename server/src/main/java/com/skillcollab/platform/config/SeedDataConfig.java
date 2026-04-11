package com.skillcollab.platform.config;

import com.skillcollab.platform.service.SeedDataService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedRunner(SeedDataService seedDataService) {
        return args -> seedDataService.seed();
    }
}
