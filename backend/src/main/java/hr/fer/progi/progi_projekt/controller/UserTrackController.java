package hr.fer.progi.progi_projekt.controller;

import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.service.UserTrackService;

@RestController
@RequestMapping("/api")
public class UserTrackController {
    UserTrackService userTrackService;

    public UserTrackController(UserTrackService service){
        this.userTrackService = service;
    }

    @GetMapping("/track/{id}")
    public UserTrack getUserTrack(@PathVariable Long id) {
        return userTrackService.getUserTrack(id);
    }
    
    @PostMapping("/track")
    public boolean createUserTrack(UserTrack profile){
        return userTrackService.createUserTrack(profile);
    }

    @PutMapping("/track")
    public boolean editUserTrack(UserTrack profile){
        return userTrackService.editUserTrack(profile);
    }

    @DeleteMapping("/track/{id}")
    public boolean deleteUserTrack(@PathVariable Long id){
        return userTrackService.deleteUserTrack(id);
    }
}
