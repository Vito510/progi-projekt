package hr.fer.progi.progi_projekt.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<UserTrackDto> getTracksForProfile(String profileUsername, HttpServletRequest request) {
        UserProfile currUser = authService.getCurrentUser(request);

        if (currUser == null) { // korisnik nije auth
            Optional<UserProfile> p = profileRepo.findByUsername(profileUsername);
            if(p.isEmpty()){
                return null;
            }
            List<UserTrack> t = trackRepo.findByOwnerIdAndVisibility(p.get().getId(), TrackVisibility.PUBLIC);

            // pretvorba u dto
            List<UserTrackDto> dtos = new ArrayList<>();
            for (UserTrack entity : t) {
                Optional<UserProfile> profile = profileRepo.findById(entity.getOwnerId());
                dtos.add(trackMapper.toDto(entity, profile.get().getUsername()));
                dtos.getLast().setWhitelist(null);
            }
            return dtos;
        }

        // korisnik trazi svoju stazu ili je admin
        if (currUser.getUsername().equals(profileUsername) || currUser.getRole() == Role.ADMIN) {
            Optional<UserProfile> p = profileRepo.findByUsername(profileUsername);
            if(p.isEmpty()){
                return null;
            }
            List<UserTrack> t = trackRepo.findByOwnerId(p.get().getId());

            // pretvorba u dto
            List<UserTrackDto> dtos = new ArrayList<>();
            for (UserTrack entity : t) {
                Optional<UserProfile> profile = profileRepo.findById(entity.getOwnerId());
                dtos.add(trackMapper.toDto(entity, profile.get().getUsername()));
            }
            
            return dtos;
        }

        // obicni korisnik trazi tudu stazu
        Optional<UserProfile> p = profileRepo.findByUsername(profileUsername);
        if(p.isEmpty()){
            return null;
        }
        List<UserTrack> t = trackRepo.findByOwnerId(p.get().getId());

        // pretvorba u dto
        List<UserTrackDto> dtos = new ArrayList<>();
        for (UserTrack entity : t) {
            if(entity.getVisibility()==TrackVisibility.PUBLIC){
                Optional<UserProfile> profile = profileRepo.findById(entity.getOwnerId());
                dtos.add(trackMapper.toDto(entity, profile.get().getUsername()));
                dtos.getLast().setWhitelist(null);
            }
            else if(entity.getWhitelistedProfiles().contains(currUser)){ // privatene staze, ako su u whitelisti
                Optional<UserProfile> profile = profileRepo.findById(entity.getOwnerId());
                dtos.add(trackMapper.toDto(entity, profile.get().getUsername()));
                dtos.getLast().setWhitelist(null);
            }
        }

        return dtos;
    }

    @Transactional
    public Integer createUserTrack(UserTrackDto userTrackDto, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);
        if(currUser==null){
            System.out.println("nije auth");
            return null;
        }

        UserTrack userTrack = trackMapper.toNewEntity(userTrackDto, currUser.getId());
        trackRepo.save(userTrack);

        updatePoints(userTrack, userTrackDto.getPoints());
       
        List<String> filteredWhitelist = new ArrayList<>(userTrackDto.getWhitelist());
        filteredWhitelist.remove(currUser.getUsername());
        updateWhitelist(userTrack, filteredWhitelist);
        return userTrack.getId();
    }

    public UserTrackDto getUserTrack(Integer id, HttpServletRequest request) {
        // trenutni korisnik
        UserProfile currUser = authService.getCurrentUser(request);

        UserTrack track = trackRepo.findById(id).orElse(null);
        if(track==null){
            return null;
        }
        if(track.getVisibility()==TrackVisibility.PRIVATE && (currUser==null ||
            (!track.getOwnerId().equals(currUser.getId())
            && !track.getWhitelistedProfiles().contains(currUser)
            && currUser.getRole()!=Role.ADMIN))){
            return null;
        }

        String ownerName = profileRepo.findById(track.getOwnerId()).get().getUsername();
        UserTrackDto dto = trackMapper.toDto(track, ownerName);

        if(currUser==null || !track.getOwnerId().equals(currUser.getId()) && currUser.getRole()!=Role.ADMIN){
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
        if(!track.get().getOwnerId().equals(currUser.getId()) && currUser.getRole()!=Role.ADMIN){
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
        if(!track.get().getOwnerId().equals(currUser.getId()) && currUser.getRole()!=Role.ADMIN){
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

        if(setStarred){
            track.get().getGivenStars().add(currUser);
        }
        else{
            track.get().getGivenStars().remove(currUser);
        }
        return track.get().getGivenStars().contains(currUser);
    }

    public List<UserTrackDto> getTopTracks() {
        var tracks = trackRepo.findTop10ByStars(PageRequest.of(0, 10));

        List<UserTrackDto> dtos = new ArrayList<>();
        for (UserTrack t : tracks) {
            if (t.getVisibility() == TrackVisibility.PRIVATE) {
                continue;
            }
            Optional<UserProfile> profile = profileRepo.findById(t.getOwnerId());
            dtos.add(trackMapper.toDto(t, profile.get().getUsername()));
        }

        return dtos;
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
        List<TrackPoint> existingPoints = entity.getPoints();

        while (existingPoints.size() > pointsDto.size()) {
            existingPoints.remove(existingPoints.size() - 1);
        }
    
        for (int i = 0; i < pointsDto.size(); i++) {
            TrackPointDto dto = pointsDto.get(i);
            TrackPoint point;
            if (i < existingPoints.size()) {
                point = existingPoints.get(i);
            } else {
                point = new TrackPoint();
                point.setTrack(entity);
                existingPoints.add(point);
            }
            point.setOrderPoint(i);
            point.setX(dto.getX());
            point.setY(dto.getY());
            point.setZ(dto.getZ());
        }
    }
}
