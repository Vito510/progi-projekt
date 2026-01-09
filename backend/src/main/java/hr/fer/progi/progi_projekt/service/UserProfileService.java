package hr.fer.progi.progi_projekt.service;

import java.util.List;

import hr.fer.progi.progi_projekt.repository.UserProfileRepository;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;

@Service
public class UserProfileService {
    private final UserProfileRepository userRepo;

    public UserProfileService(UserProfileRepository userRepo) {
        this.userRepo = userRepo;
    }

    public List<UserProfile> getAllUserProfiles() {
        return userRepo.findAll();
    }

    public boolean userExistsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    public boolean userExistsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    public void saveUserProfile(UserProfile userProfile) {
        userRepo.save(userProfile);
    }

    public UserProfile getUserProfileByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    public Long getUserIdByEmail(String email) {
        return userRepo.findByEmail(email)
                .map(UserProfile::getId)
                .orElse(null);
    }


    public void createProfile(String username, HttpServletRequest request) {
        System.out.println("Trying to create user: " + username);

        String jwt = null;
        String email = null;
        JwtUtil jwtUtil = new JwtUtil();

        // Get JWT from Authorization header
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            System.out.println("JWT: " + jwt);

            try {
                email = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("Failed to extract email from JWT: " + e.getMessage());
            }
        }

        System.out.println("Email extracted: " + email);

        if (email == null) {
            // No valid JWT/email, cannot create profile
            System.out.println("No valid email found, aborting profile creation.");
            return;
        }

        if (userExistsByEmail(email)) {
            System.out.println("User already exists with email: " + email);
            return;
        }

        System.out.println("Creating new user: " + username);
        UserProfile userProfile = new UserProfile(username, email, Role.USER);

        try {
            saveUserProfile(userProfile);
            System.out.println("User created successfully!");
        } catch (Exception e) {
            System.out.println("Error saving user profile: " + e.getMessage());
        }
    }


    public UserProfile getProfile(long id) {
        return userRepo.findById(id).orElse(null);
    }

    public UserProfile editProfile(UserProfile profile) {
        UserProfile existingUser = userRepo.findById(profile.getId()).orElse(null);

        if (existingUser == null) {
            System.out.println("User with ID " + profile.getId() + " not found");
            return null;
        }

        if (userExistsByUsername(profile.getUsername())) {
            System.out.println("Username " + profile.getUsername() + " is already taken");
            return null;
        }

        existingUser.setUsername(profile.getUsername());
        //existingUser.setEmail(profile.getEmail());
        //existingUser.setRole(profile.getRole());

        return userRepo.save(existingUser);
    }

    public void deleteProfile(long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            System.out.println("User with ID " + id + " has been deleted");
        }
        else {
            System.out.println("User with ID " + id + " not found");
        }
    }

}
