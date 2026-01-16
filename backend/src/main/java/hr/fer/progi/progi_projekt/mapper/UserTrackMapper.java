package hr.fer.progi.progi_projekt.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.model.TrackPoint;
import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.repository.UserProfileRepository;

@Component
public class UserTrackMapper {
    UserProfileRepository profileRepo;

    public UserTrackMapper(UserProfileRepository profileRepo) {
        this.profileRepo = profileRepo;
    }

    public UserTrackDto toDto(UserTrack entity, int numOfStars, String ownerName, List<TrackPoint> points, List<String> whitelist) {
        if (entity == null) {
            return null;
        }

        UserTrackDto dto = new UserTrackDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDateCreated(entity.getDateCreated());
        dto.setMinLat(entity.getMinLat());
        dto.setMinLon(entity.getMinLon());
        dto.setMaxLat(entity.getMaxLat());
        dto.setMaxLon(entity.getMaxLon());
        dto.setVisibility(entity.getVisibility());

        dto.setNumOfStars(numOfStars);
        dto.setOwnerName(ownerName);
        dto.setPoints(points);
        dto.setWhitelist(whitelist);

        return dto;
    }

    public UserTrack toEntity(UserTrackDto dto, Long ownerId) {
        if (dto == null) {
            return null;
        }

        UserTrack entity = new UserTrack();

        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDateCreated(dto.getDateCreated());
        entity.setMinLat(dto.getMinLat());
        entity.setMinLon(dto.getMinLon());
        entity.setMaxLat(dto.getMaxLat());
        entity.setMaxLon(dto.getMaxLon());
        entity.setVisibility(dto.getVisibility());

        entity.setOwnerId(ownerId);

        return entity;
    }
}
