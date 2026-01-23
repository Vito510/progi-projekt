package hr.fer.progi.progi_projekt.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.dto.UserProfileDto;
import hr.fer.progi.progi_projekt.service.UserProfileService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
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

    @PostMapping("/profile")
    public ResponseEntity<String> createUser(@RequestParam String username, HttpServletRequest request) {
        String err = userProfileService.createProfile(username, request);
        if(!err.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(err);
        }
        return ResponseEntity.ok("");
    }

    @GetMapping("/profile/{username}")
    public UserProfileDto getProfile(@PathVariable String username, HttpServletRequest request) {
        return userProfileService.getProfile(username, request);
    }

    @PutMapping("/profile/{username}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String username,
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {
        String newUsername = body.get("username");
        return userProfileService.updateUsername(username, newUsername, request);
    }

    @DeleteMapping("/profile/{username}")
    public ResponseEntity<String> deleteProfileByUsername(
            @PathVariable String username,
            HttpServletRequest request
    ) {
        if (!userProfileService.userExistsByUsername(username)) {
            return ResponseEntity.status(404).body("User not found");
        }

        userProfileService.deleteProfileByUsername(username, request);
        return ResponseEntity.ok("Profile deleted");
    }
}
