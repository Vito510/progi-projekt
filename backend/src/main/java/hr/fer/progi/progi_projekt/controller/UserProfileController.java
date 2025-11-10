package hr.fer.progi.progi_projekt.controller;

import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.service.UserProfileService;

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
