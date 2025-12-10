package hr.fer.progi.progi_projekt.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.service.UserProfileService;

import java.util.Map;

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

    @DeleteMapping("/profile/{id}")
    public void deleteProfile(@PathVariable int id){
        userProfileService.deleteProfile(id);
    }
}
