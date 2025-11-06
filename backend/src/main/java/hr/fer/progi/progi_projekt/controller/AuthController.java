package hr.fer.progi.progi_projekt.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AuthController {
    @GetMapping("/login")
    public void login(){
        // TODO login
    }

    @GetMapping("/logout")
    public void logout(){
        // TODO logout
    }
}
