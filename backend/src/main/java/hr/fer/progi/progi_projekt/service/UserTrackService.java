package hr.fer.progi.progi_projekt.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.repository.UserTrackRepository;

@Service
public class UserTrackService {
    private UserTrackRepository trackRepo;

    public boolean createUserTrack(UserTrack userTrack) {
        if(!trackRepo.findByName(userTrack.getName()).isEmpty()){
            return false;
        }
        trackRepo.save(userTrack);
        return true;
    }

    public UserTrack getUserTrack(Long id) {
        UserTrack track = trackRepo.findById(id).orElse(null);
        return track;
    }

    public boolean editUserTrack(UserTrack userTrack) {
        if(trackRepo.findByName(userTrack.getName()).isEmpty()){
            return false;
        }
        trackRepo.save(userTrack);
        return true;
    }

    public boolean deleteUserTrack(Long id) {
        Optional<UserTrack> track = trackRepo.findById(id);
        if(track.isEmpty()){
            return false;
        }
        trackRepo.delete(track.get());
        return true;
    }
}
