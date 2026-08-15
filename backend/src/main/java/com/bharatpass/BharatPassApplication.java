package com.bharatpass;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BharatPassApplication {

    public static void main(String[] args) {
        // Enable Virtual Threads (Project Loom)
        System.setProperty("spring.threads.virtual.enabled", "true");
        SpringApplication.run(BharatPassApplication.class, args);
    }
}
