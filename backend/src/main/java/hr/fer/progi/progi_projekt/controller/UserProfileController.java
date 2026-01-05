package hr.fer.progi.progi_projekt.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.service.UserProfileService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserProfileController {
    UserProfileService userProfileService;

    public UserProfileController(UserProfileService service){
        this.userProfileService = service;
    }

    @GetMapping("/check-username")
    public Map<String, Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userProfileService.userExistsByUsername(username);
        return Map.of("exists", exists);
    }

    @GetMapping("/create-user")
    public void createUser(@RequestParam String username, HttpServletRequest request) {
        userProfileService.createProfile(username, request);
    }

    @GetMapping("/profile/{id}")
    public UserProfile getProfile(@PathVariable int id) {
        return userProfileService.getProfile(id);
    }

    @PutMapping("/profile")
    public UserProfile editProfile(@RequestBody UserProfile profile){
        return userProfileService.editProfile(profile);
    }

    @PutMapping("/profile/me")
    public ResponseEntity<UserProfile> editCurrentUser(
            Authentication authentication,
            @RequestBody Map<String, String> body)
    {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        Long userId = userProfileService.getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.status(404).build();
        }

        String newUsername = body.get("username");
        if (newUsername == null || newUsername.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        UserProfile existingUser = userProfileService.getProfile(userId);
        if (existingUser == null) {
            return ResponseEntity.status(404).build();
        }

        if (userProfileService.userExistsByUsername(newUsername)) {
            return ResponseEntity.status(409).body(null);
        }

        existingUser.setUsername(newUsername);

        UserProfile updated = userProfileService.editProfile(existingUser);

        return ResponseEntity.ok(updated);
    }



    @DeleteMapping("/profile/{id}")
    public void deleteProfile(@PathVariable int id) {
        userProfileService.deleteProfile(id);
    }

    @DeleteMapping("/profile/me")
    public ResponseEntity<String> deleteCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();

        Long userId = userProfileService.getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        userProfileService.deleteProfile(userId);
        return ResponseEntity.ok("Profile deleted");
    }
}
