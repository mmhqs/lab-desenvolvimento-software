package com.example.LDSlab3.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LDSlab3.LdSlab3Application;

@SpringBootApplication
public class AuthController {

    public static void main(String[] args) {
        SpringApplication.run(LdSlab3Application.class, args);
    }
}

@RestController
@RequestMapping("/api")
class MeuController {
    
    @GetMapping("/ola")
    public String dizerOla() {
        return "Olá, Spring Boot!";
    }
}