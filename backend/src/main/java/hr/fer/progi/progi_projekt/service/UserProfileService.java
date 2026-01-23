package hr.fer.progi.progi_projekt.service;

import java.util.List;
import java.util.Optional;

import hr.fer.progi.progi_projekt.repository.UserProfileRepository;
import hr.fer.progi.progi_projekt.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.dto.UserProfileDto;
import hr.fer.progi.progi_projekt.mapper.UserProfileMapper;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;

@Service
public class UserProfileService {
    private final UserProfileRepository userRepo;
    private final UserProfileMapper userMapper;
    private final AuthService authService;

    public UserProfileService(UserProfileRepository userRepo,
                              UserProfileMapper userMapper,
                              AuthService authService) {
        this.userRepo = userRepo;
        this.userMapper = userMapper;
        this.authService = authService;
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

    public Integer getUserIdByEmail(String email) {
        return userRepo.findByEmail(email)
                .map(UserProfile::getId)
                .orElse(null);
    }


    public String createProfile(String username, HttpServletRequest request) {
        System.out.println("Trying to create user: " + username);
        boolean exists = userExistsByUsername(username);

        if (exists) {
            return "Korisničko ime već postoji. Odaberite drugo.";
        } else if (username.length() > 25) {
            return "Korisničko ime ne može biti dulje od 25 znakova";
        }

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
            return "Internal error";
        }

        if (userExistsByEmail(email)) {
            System.out.println("User already exists with email: " + email);
            return "Ovaj email već ima profil";
        }

        System.out.println("Creating new user: " + username);
        UserProfile userProfile = new UserProfile(username, email, Role.USER);

        try {
            saveUserProfile(userProfile);
            System.out.println("User created successfully!");
        } catch (Exception e) {
            System.out.println("Error saving user profile: " + e.getMessage());
        }

        return "";
    }


    public UserProfileDto getProfile(String username, HttpServletRequest request) {
        UserProfile currUser = authService.getCurrentUser(request);

        Optional<UserProfile> profile = userRepo.findByUsername(username);
        if(profile.isEmpty()){
            return null;
        }
        UserProfileDto dto = userMapper.toDto(profile.get());
        if(currUser == null || (!profile.get().getId().equals(currUser.getId()) && currUser.getRole()!=Role.ADMIN)){
            dto.setEmail(null);
            dto.setRole(null);
        }
        return dto;
    }

    public ResponseEntity<?> updateUsername(String oldUsername, String newUsername, HttpServletRequest request) {
        Optional<UserProfile> user = userRepo.findByUsername(oldUsername);
        if(user.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ne postoji traženi korisnik");
        }

        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autoriziran");
        }

        if (!currUser.getUsername().equals(oldUsername) && currUser.getRole() == Role.USER) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije vlasnik profila");
        }

        if (userRepo.existsByUsername(newUsername)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Korisničko ime je već zauzeto");
        }

        user.get().setUsername(newUsername);
        userRepo.save(user.get());
        return ResponseEntity.ok(userMapper.toDto(user.get()));
    }

    public void deleteProfileByUsername(String username, HttpServletRequest request) {
        UserProfile user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return;
        }

        if (!currUser.getUsername().equals(username) && currUser.getRole() == Role.USER) {
            return;
        }

        userRepo.delete(user);
    }
}
