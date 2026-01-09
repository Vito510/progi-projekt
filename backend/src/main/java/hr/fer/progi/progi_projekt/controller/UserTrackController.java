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
    public UserTrack getUserTrack(@PathVariable int id) {
        return userTrackService.getUserTrack(id);
    }
    
    @PostMapping("/track")
    public UserTrack createUserTrack(UserTrack profile){
        return userTrackService.createUserTrack(profile);
    }

    @PutMapping("/track")
    public UserTrack editUserTRack(UserTrack profile){
        return userTrackService.editUserTrack(profile);
    }

    @DeleteMapping("/track/{id}")
    public void deleteUserTrack(@PathVariable int id){
        userTrackService.deleteUserTrack(id);
    }
}
