package hr.fer.progi.progi_projekt.service;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.dto.AuthResponse;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import hr.fer.progi.progi_projekt.repository.UserProfileRepository;

@Service
public class AuthService {

    private final UserProfileRepository userProfileRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserProfileRepository userProfileRepository,
                       JwtUtil jwtUtil) {
        this.userProfileRepository = userProfileRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse getCurrentUserResponse(HttpServletRequest request) {
        UserProfile user = getCurrentUser(request);
        if (user != null) {
            return new AuthResponse(true, user.getUsername(), user.getEmail(), user.getRole());
        }
        return new AuthResponse(false, "", "", null);
    }

    public UserProfile getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String jwt = authHeader.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        if (email == null) {
            return null;
        }

        return userProfileRepository.findByEmail(email).orElse(null);
    }

    public Integer getCurrentUserId(HttpServletRequest request) {
        UserProfile user = getCurrentUser(request);
        return user != null ? user.getId() : null;
    }
}