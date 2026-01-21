package hr.fer.progi.progi_projekt.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.service.UserTrackService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;


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
            HttpServletRequest request
    ) {
        return userTrackService.getTracksForProfile(username, request);
    }


    @GetMapping("/track/{id}")
    public UserTrackDto getUserTrack(@PathVariable Integer id, HttpServletRequest request) {
        return userTrackService.getUserTrack(id, request);
    }
    
    @PostMapping("/track")
    public boolean createUserTrack(@RequestBody UserTrackDto track, HttpServletRequest request){
        return userTrackService.createUserTrack(track, request);
    }

    @PutMapping("/track")
    public boolean editUserTrack(@RequestBody UserTrackDto track, HttpServletRequest request){
        return userTrackService.editUserTrack(track, request);
    }

    @DeleteMapping("/track/{id}")
    public boolean deleteUserTrack(@PathVariable Integer id, HttpServletRequest request){
        return userTrackService.deleteUserTrack(id, request);
    }

    @GetMapping("/track/top")
    public List<TopTrackDto> getTopTracks() {
        return userTrackService.getTopTracks();
    }

    @GetMapping("/track/{id}/star")
    public Boolean isTrackStarred(@PathVariable Integer id, HttpServletRequest request) {
        return userTrackService.isTrackStarred(id, request);
    }

    @PutMapping("/track/{id}/star")
    public Boolean setTrackStarred(@PathVariable Integer id, @RequestBody boolean isStarred, HttpServletRequest request) {
        return userTrackService.setTrackStarred(id, isStarred, request);
    }
    
}
