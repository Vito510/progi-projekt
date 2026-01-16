package hr.fer.progi.progi_projekt.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.mapper.UserTrackMapper;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.model.enums.Role;
import hr.fer.progi.progi_projekt.repository.UserTrackRepository;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserTrackService {
    private final UserTrackRepository trackRepo;
    private final AuthService authService;
    private final UserTrackMapper trackMapper;

    public UserTrackService(UserTrackRepository trackRepo, AuthService authService, UserTrackMapper trackMapper) {
        this.trackRepo = trackRepo;
        this.authService = authService;
        this.trackMapper = trackMapper;
    }

    public List<TopTrackDto> getTracksForProfile(String profileUsername, String viewerUsername) {
        boolean isOwner = profileUsername.equals(viewerUsername);

        if (isOwner) {
            return trackRepo.findAllByOwnerUsername(profileUsername);
        }

        return trackRepo.findPublicAndWhitelisted(profileUsername, viewerUsername);
    }

    public boolean createUserTrack(UserTrackDto userTrackDto, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            System.out.println("nije auth");
            return false;
        }

        // ownerName -> ownerId
        // Optional<UserProfile> ownerProfile = profileRepo.findByUsername(userTrackDto.getOwnerName());
        // if(ownerProfile.isEmpty()){
        //     System.out.println("ne postoji owner");
        //     return false;
        // }
        // // ako nisi admin, smijes samo sebi dodati stazu
        // if(ownerProfile.get().getId()!=currUser.getId() && currUser.getRole()!=Role.ADMIN){
        //     System.out.println("ne stavljas sebi");
        //     return false;
        // }
        // UserTrack userTrack = trackMapper.toEntity(userTrackDto, ownerProfile.get().getId());
        UserTrack userTrack = trackMapper.toEntity(userTrackDto, currUser.getId());
        userTrack.setId(null);
        trackRepo.save(userTrack);
        return true;
    }

    public UserTrack getUserTrack(Long id) {
        UserTrack track = trackRepo.findById(id).orElse(null);
        return track;
    }

    public boolean editUserTrack(UserTrackDto userTrackDto, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return false;
        }
        
        Optional<UserTrack> track = trackRepo.findById(userTrackDto.getId());
        if(track.isEmpty()){
            System.out.println("Ne postoji staza " + userTrackDto.getName());
            return false;
        }
        
        // ako nisi admin, ne smijes uredivati tudu stazu
        if(track.get().getOwnerId()!=currUser.getId() && currUser.getRole()!=Role.ADMIN){
            System.out.println("Korisnik nije vlasnik staze");
            return false;
        }
        
        UserTrack userTrack = trackMapper.toEntity(userTrackDto, track.get().getOwnerId());
        trackRepo.save(userTrack);
        return true;
    }

    public boolean deleteUserTrack(Long id, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return false;
        }
        
        Optional<UserTrack> track = trackRepo.findById(id);
        if(track.isEmpty()){
            System.out.println("Ne postoji trazena staza (id=" + id + ")");
            return false;
        }

        // ako nisi admin, ne smijes brisati tudu stazu
        if(track.get().getOwnerId()!=currUser.getId() && currUser.getRole()!=Role.ADMIN){
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
