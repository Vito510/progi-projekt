package hr.fer.progi.progi_projekt.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.repository.UserTrackRepository;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserTrackService {
    private final UserTrackRepository trackRepo;
    private final AuthService authService;

    public UserTrackService(UserTrackRepository trackRepo, AuthService authService) {
        this.trackRepo = trackRepo;
        this.authService = authService;
    }

    public List<TopTrackDto> getTracksForProfile(String profileUsername, String viewerUsername) {
        boolean isOwner = profileUsername.equals(viewerUsername);

        if (isOwner) {
            return trackRepo.findAllByOwnerUsername(profileUsername);
        }

        return trackRepo.findPublicAndWhitelisted(profileUsername, viewerUsername);
    }

    public boolean createUserTrack(UserTrack userTrack, HttpServletRequest request) {
        Long ownerId = authService.getCurrentUserId(request);
        if(ownerId==null){
            return false;
        }

        if(!trackRepo.findByName(userTrack.getName()).isEmpty()){
            System.out.println("Vec postoji ime " + userTrack.getName());
            return false;
        }

        userTrack.setOwnerId(ownerId);
        trackRepo.save(userTrack);
        return true;
    }

    public UserTrack getUserTrack(Long id) {
        UserTrack track = trackRepo.findById(id).orElse(null);
        return track;
    }

    public boolean editUserTrack(UserTrack userTrack, HttpServletRequest request) {
        Long ownerId = authService.getCurrentUserId(request);
        if(ownerId==null){
            return false;
        }

        Optional<UserTrack> track = trackRepo.findById(userTrack.getId());
        if(track.isEmpty()){
            System.out.println("Ne postoji staza " + userTrack.getName());
            return false;
        }

        if(track.get().getOwnerId()!=ownerId){
            System.out.println("Korisnik nije vlasnik staze");
            return false;
        }
        
        trackRepo.save(userTrack);
        return true;
    }

    public boolean deleteUserTrack(Long id, HttpServletRequest request) {
        Long ownerId = authService.getCurrentUserId(request);
        if(ownerId==null){
            return false;
        }
        
        Optional<UserTrack> track = trackRepo.findById(id);
        if(track.isEmpty()){
            System.out.println("Ne postoji trazena staza (id=" + id + ")");
            return false;
        }
        if(track.get().getOwnerId()!=ownerId){
            System.out.println("Korisnik nije vlasnik staze");
            return false;
        }

        trackRepo.delete(track.get());
        return true;
    }

    public List<TopTrackDto> getTopTracks() {
        return trackRepo.findTop10Tracks();
    }
}
