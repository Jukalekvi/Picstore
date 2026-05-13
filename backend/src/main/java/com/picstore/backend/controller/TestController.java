package com.picstore.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("api/test")
    public String sayHello() {
        return "Connection to backend is working!";
    }
}
