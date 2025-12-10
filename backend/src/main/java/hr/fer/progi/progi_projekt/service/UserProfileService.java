package hr.fer.progi.progi_projekt.service;

import java.util.List;

import hr.fer.progi.progi_projekt.repository.UserRepository;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;

@Service
public class UserProfileService {
    private final UserRepository userRepo;

    public UserProfileService(UserRepository userRepo) {
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

    public void createProfile(String username, HttpServletRequest request) {
        System.out.println("Trying to create user: " + username);
        // provjeri postoji li user sa tim emailom vec
        String jwt = null;
        String email = null;
        JwtUtil jwtUtil = new JwtUtil();
        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer ")) {
            jwt = request.getHeader("Authorization").substring(7);
        }

        if (jwt != null) {
            email = jwtUtil.extractUsername(jwt);
        }

        if (userExistsByEmail(email)) {
            //korisnik vec postoji, ignoraj
            System.out.println("User already exists");
            return;
        }

        System.out.println("Kreiram novi user: " + username);
        UserProfile userProfile = new UserProfile(username, email, Role.USER);
        saveUserProfile(userProfile);
    }

    public UserProfile getProfile(int id) {
        return null;
    }

    public UserProfile editProfile(UserProfile profile) {
        return null;
    }

    public void deleteProfile(int id) {
        
    }

}
