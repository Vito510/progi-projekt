package hr.fer.progi.progi_projekt.service;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.dto.AuthResponse;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {
    private final UserProfileService userProfileService;

    AuthService(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    public AuthResponse getCurrentUserResponse(HttpServletRequest request) {
        UserProfile user = getCurrentUser(request);
        if (user != null) {
            return new AuthResponse(true, user.getUsername(), user.getEmail(), user.getRole());
        }
        return new AuthResponse(false, "", "", null);
    }

    public UserProfile getCurrentUser(HttpServletRequest request) {
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
        return user;
    }

    public Integer getCurrentUserId(HttpServletRequest request){
        UserProfile user = getCurrentUser(request);
        if(user==null){
            System.out.println("Ne vrijedi autentifikacija");
            return null;
        }
        return user.getId();
    }
}
