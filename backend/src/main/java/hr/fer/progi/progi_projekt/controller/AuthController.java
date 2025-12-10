package hr.fer.progi.progi_projekt.controller;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.service.UserProfileService;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private UserProfileService userProfileService;

    // API za FE da dohvatimo trenutno prijavljenog korisnika
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(HttpServletRequest request) {

        String jwt = null;
        String email = null;
        UserProfile user = null;
        JwtUtil jwtUtil = new JwtUtil();
        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer ")) {
            jwt = request.getHeader("Authorization").substring(7);
            System.out.println("/me JWT: " + jwt);
        }

        if (jwt != null) {
            email = jwtUtil.extractUsername(jwt);
        }

        if (email != null) {
            user = userProfileService.getUserProfileByEmail(email);
        }

        if (user != null) {
            return Map.of(
                    "authenticated", true,
                    "name", user.getUsername(),
                    "email", email);
        }


        return Map.of("authenticated", false);

    }

    // Endpoint za početak Google login-a
//    @GetMapping("/auth/google")
//    public void redirectToGoogle(javax.servlet.http.HttpServletResponse response) throws java.io.IOException {
//        response.sendRedirect("/oauth2/authorization/google");
//    }

    @GetMapping("/auth/google")
    public RedirectView redirectToGoogle() {
        return new RedirectView("/oauth2/authorization/google");
    }
}