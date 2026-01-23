package hr.fer.progi.progi_projekt.service;

import hr.fer.progi.progi_projekt.dto.TrackPointDto;
import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.model.enums.Role;
import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;
import hr.fer.progi.progi_projekt.security.JwtUtil;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
@ActiveProfiles("test")
public class UserTrackServiceTest {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired UserTrackService userTrackService;

    JwtUtil jwtUtil = new JwtUtil();

    @Test
    void createTrack() {
        // Test kreacije staze
        UserProfile userProfile = new UserProfile("track_creator","track_creator@gmail.com", Role.USER);
        userProfileService.saveUserProfile(userProfile);
        String token = jwtUtil.generateToken(userProfile.getEmail());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        // Kreacija staze za testove
        UserTrackDto track = new UserTrackDto();
        TrackPointDto point = new TrackPointDto();
        track.setName("Hallo");
        track.setVisibility(TrackVisibility.PRIVATE);
        List<String> whitelist = new ArrayList<>();
        whitelist.add("Pero");
        track.setWhitelist(whitelist);
        track.setId(0);
        point.setX(0f);
        point.setY(0f);
        point.setZ(0f);
        track.setPoints(List.of(point));
        userTrackService.createUserTrack(track, request);

        // Provjera
        var check = userTrackService.getTracksForProfile(userProfile.getUsername(), request).getFirst();
        assertThat(check.getName()).isEqualTo(track.getName());
    }

    @Test
    void accessPrivateTrackUnwhitelisted() {
        // Moze li newhitelistan korisnik pristupiti privatnoj stazi (ne moze)
        UserProfile userProfile = new UserProfile("track_viewer","track_viewer@gmail.com", Role.USER);
        userProfileService.saveUserProfile(userProfile);
        String token = jwtUtil.generateToken(userProfile.getEmail());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);
        
        var found  = userTrackService.getTracksForProfile("track_creator", request);
        assertThat(found.size()).isEqualTo(0);
    }

    @Test
    void accessPrivateTrackWhitelisted() {
        // Moze li whitelistan korisnik pristupiti privatnoj stazi (moze)
        UserProfile userProfile = new UserProfile("Pero","pero@gmail.com", Role.USER);
        userProfileService.saveUserProfile(userProfile);
        String token = jwtUtil.generateToken(userProfile.getEmail());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        var found  = userTrackService.getTracksForProfile("track_creator", request);
        assertThat(found.size()).isEqualTo(1);
    }

    @Test
    void accessPrivateTrackAdmin() {
        // Moze li newhitelistan admin korisnik pristupiti privatnoj stazi (moze)
        UserProfile userProfile = new UserProfile("Admin","admin@gmail.com", Role.ADMIN);
        userProfileService.saveUserProfile(userProfile);
        String token = jwtUtil.generateToken(userProfile.getEmail());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer "+token);

        var found  = userTrackService.getTracksForProfile("track_creator", request);
        assertThat(found.size()).isEqualTo(1);
    }



}
