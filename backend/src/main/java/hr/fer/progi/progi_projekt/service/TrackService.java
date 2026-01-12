package hr.fer.progi.progi_projekt.service;

import hr.fer.progi.progi_projekt.repository.TrackRepository;
import org.springframework.stereotype.Service;
import hr.fer.progi.progi_projekt.dto.TopTrackDto;

import java.util.List;

@Service
public class TrackService {

    private final TrackRepository trackRepository;

    public TrackService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    public List<TopTrackDto> getTopTracks() {
        return trackRepository.findTop10Tracks();
    }
}