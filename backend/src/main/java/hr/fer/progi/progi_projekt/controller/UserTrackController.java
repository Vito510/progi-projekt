package hr.fer.progi.progi_projekt.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.service.UserTrackService;
import org.springframework.security.core.Authentication;
import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserTrackController {
    UserTrackService userTrackService;

    public UserTrackController(UserTrackService service){
        this.userTrackService = service;
    }

    @GetMapping("profile/{username}/tracks")
    public List<TopTrackDto> getProfileTracks(
            @PathVariable String username,
            Authentication auth,
            Principal principal
    ) {
        String viewerUsername = (principal != null) ? principal.getName() : "anonymous";
        return userTrackService.getTracksForProfile(username, viewerUsername);
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

    @GetMapping("/track/top")
    public List<TopTrackDto> getTopTracks() {
        return userTrackService.getTopTracks();
    }
}
