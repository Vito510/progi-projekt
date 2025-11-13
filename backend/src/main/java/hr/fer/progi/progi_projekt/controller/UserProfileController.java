package hr.fer.progi.progi_projekt.controller;

import hr.fer.progi.progi_projekt.model.enums.Role;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.service.UserProfileService;

import java.util.Map;
import java.util.Optional;

@RestController
public class UserProfileController {
    UserProfileService userProfileService;

    public UserProfileController(UserProfileService service){
        this.userProfileService = service;
    }

    @GetMapping("/profile/{id}")
    public UserProfile getProfile(@PathVariable int id) {
        return userProfileService.getProfile(id);
    }

    public UserProfile getProfileByEmail(String email) {
        return userProfileService.getUserProfileByEmail(email);
    }
    @GetMapping("/test")
    public void Test() {
        System.out.println(userProfileService.getUserProfileByEmail("test@gmail.com"));
        System.out.println(userProfileService.getAllUserProfiles());
    }

    @GetMapping("/check-username")
    public Map<String, Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userProfileService.userExistsByUsername(username);
        return Map.of("exists", exists);
    }

    @GetMapping("/create-user")
    public void createUser(@RequestParam String username, HttpServletRequest request) {

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

        if (userProfileService.userExistsByEmail(email)) {
            //korisnik vec postoji, ignoraj
            System.out.println("User already exists");
            return;
        }

        System.out.println("Kreiram novi user: " + username);
        UserProfile userProfile = new UserProfile(username, email, Role.USER);
        userProfileService.saveUserProfile(userProfile);

    }

    @PostMapping("/profile")
    public UserProfile register(@RequestBody UserProfile profile){
        return userProfileService.register(profile);
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
