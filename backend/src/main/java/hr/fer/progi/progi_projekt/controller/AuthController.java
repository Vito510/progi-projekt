package hr.fer.progi.progi_projekt.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    // API za FE da dohvatimo trenutno prijavljenog korisnika
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return Map.of("authenticated", false);
        }
        return Map.of(
                "authenticated", true,
                "name", user.getAttribute("name"),
                "email", user.getAttribute("email")
        );
    }

    // Endpoint za početak Google login-a
    @GetMapping("/auth/google")
    public void redirectToGoogle(javax.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }
}