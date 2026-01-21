package hr.fer.progi.progi_projekt.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.dto.TrackPointDto;
import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.mapper.TrackPointMapper;
import hr.fer.progi.progi_projekt.mapper.UserTrackMapper;
import hr.fer.progi.progi_projekt.model.TrackPoint;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.model.enums.Role;
import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;
import hr.fer.progi.progi_projekt.repository.UserProfileRepository;
import hr.fer.progi.progi_projekt.repository.UserTrackRepository;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserTrackService {
    private final UserTrackRepository trackRepo;
    private final UserProfileRepository profileRepo;
    private final AuthService authService;
    private final UserTrackMapper trackMapper;
    private final TrackPointMapper pointMapper;

    public UserTrackService(
        UserTrackRepository trackRepo,
        AuthService authService, 
        UserTrackMapper trackMapper, 
        UserProfileRepository profileRepo,
        TrackPointMapper pointMapper
    ) {
        this.trackRepo = trackRepo;
        this.profileRepo = profileRepo;
        this.authService = authService;
        this.trackMapper = trackMapper;
        this.pointMapper = pointMapper;
    }

    public List<TopTrackDto> getTracksForProfile(String profileUsername, String viewerUsername) {
        boolean isOwner = profileUsername.equals(viewerUsername);

        if (isOwner) {
            return trackRepo.findAllByOwnerUsername(profileUsername);
        }

        return trackRepo.findPublicAndWhitelisted(profileUsername, viewerUsername);
    }

    @Transactional
    public boolean createUserTrack(UserTrackDto userTrackDto, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            System.out.println("nije auth");
            return false;
        }

        UserTrack userTrack = trackMapper.toNewEntity(userTrackDto, currUser.getId());
        trackRepo.save(userTrack);

        updatePoints(userTrack, userTrackDto.getPoints());
       
        List<String> filteredWhitelist = new ArrayList<>(userTrackDto.getWhitelist());
        filteredWhitelist.remove(currUser.getUsername());
        updateWhitelist(userTrack, filteredWhitelist);
        return true;
    }

    public UserTrackDto getUserTrack(Integer id, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return null;
        }

        UserTrack track = trackRepo.findById(id).orElse(null);
        if(track==null){
            return null;
        }
        if(track.getVisibility()==TrackVisibility.PRIVATE
            && track.getOwnerId()!=currUser.getId()
            && !track.getWhitelistedProfiles().contains(currUser)
            && currUser.getRole()!=Role.ADMIN){
            return null;
        }

        String ownerName = profileRepo.findById(track.getOwnerId()).get().getUsername();
        UserTrackDto dto = trackMapper.toDto(track, ownerName);

        if(track.getOwnerId()!=currUser.getId() && currUser.getRole()!=Role.ADMIN){
            dto.setWhitelist(null);
        }

        return dto;
    }

    @Transactional
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
        
        UserTrack userTrack = trackMapper.updateEntity(userTrackDto, track.get());
        trackRepo.save(userTrack);

        updatePoints(userTrack, userTrackDto.getPoints());

        List<String> filteredWhitelist = new ArrayList<>(userTrackDto.getWhitelist());
        if(currUser.getRole()!=Role.ADMIN){
            filteredWhitelist.remove(currUser.getUsername());
        }
        updateWhitelist(userTrack, filteredWhitelist);
        return true;
    }

    public boolean deleteUserTrack(Integer id, HttpServletRequest request) {
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

    public Boolean isTrackStarred(Integer id, HttpServletRequest request){
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return null;
        }
        Optional<UserTrack> track = trackRepo.findById(id);
        if(track.isEmpty()){
            return null;
        }

        return track.get().getGivenStars().contains(currUser);
    }

    @Transactional
    public Boolean setTrackStarred(Integer id, boolean setStarred, HttpServletRequest request){
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            return null;
        }
        Optional<UserTrack> track = trackRepo.findById(id);
        if(track.isEmpty()){
            return null;
        }

        System.out.println("ode jeee");

        if(setStarred){
            System.out.println("staraj");
            track.get().getGivenStars().add(currUser);
        }
        else{
            System.out.println("makni star");
            track.get().getGivenStars().remove(currUser);
        }
        return track.get().getGivenStars().contains(currUser);
    }

    public List<TopTrackDto> getTopTracks() {
        return trackRepo.findTop10Tracks();
    }

    public void updateWhitelist(UserTrack entity, List<String> whitelist){
        Set<UserProfile> whitelistedProfiles = new HashSet<>();
        for (String name : whitelist) {
            Optional<UserProfile> profile = profileRepo.findByUsername(name);
            if(profile.isPresent()){
                whitelistedProfiles.add(profile.get());
            }
        }
        entity.setWhitelistedProfiles(whitelistedProfiles);
    }

    public void updatePoints(UserTrack entity, List<TrackPointDto> pointsDto){
        List<TrackPoint> points = entity.getPoints();
        entity.getPoints().clear();

        for (int i = 0; i<pointsDto.size(); i++) {
            TrackPoint p = pointMapper.toEntity(pointsDto.get(i));
            p.setOrderPoint(i);
            p.setTrack(entity);
            points.add(p);
        }
    }
}
