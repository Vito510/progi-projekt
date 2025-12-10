package hr.fer.progi.progi_projekt.service;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.model.AuthResponse;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {
    private final UserProfileService userProfileService;

    AuthService(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    public AuthResponse getCurrentUser(HttpServletRequest request) {
        String jwt = null;
        String email = null;
        UserProfile user = null;
        JwtUtil jwtUtil = new JwtUtil();
        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer ")) {
            jwt = request.getHeader("Authorization").substring(7);
            //System.out.println("/me JWT: " + jwt);
        }

        if (jwt != null) {
            email = jwtUtil.extractUsername(jwt);
        }

        if (email != null) {
            user = userProfileService.getUserProfileByEmail(email);
        }

        if (user != null) {
            return new AuthResponse(true, user.getUsername(), email);
        }

        return new AuthResponse(false, "", "");
    }
}
