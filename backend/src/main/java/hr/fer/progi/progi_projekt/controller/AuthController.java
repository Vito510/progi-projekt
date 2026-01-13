package hr.fer.progi.progi_projekt.controller;

import hr.fer.progi.progi_projekt.model.AuthResponse;
import hr.fer.progi.progi_projekt.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class AuthController {
    private AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    // API za FE da dohvatimo trenutno prijavljenog korisnika
    @GetMapping("/me")
    public AuthResponse getCurrentUser(HttpServletRequest request) {
        return authService.getCurrentUser(request);
    }

    @GetMapping("/auth/google")
    public RedirectView redirectToGoogle() {
        return new RedirectView("/oauth2/authorization/google");
    }
}