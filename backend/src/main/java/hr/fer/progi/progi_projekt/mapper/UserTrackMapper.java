package hr.fer.progi.progi_projekt.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.dto.TrackPointDto;
import hr.fer.progi.progi_projekt.dto.UserTrackDto;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.UserTrack;

@Component
public class UserTrackMapper {
    private final TrackPointMapper pointMapper;

    public UserTrackMapper(TrackPointMapper pointMapper) {
        this.pointMapper = pointMapper;
    }

    public UserTrackDto toDto(UserTrack entity, String ownerName) {
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
        dto.setNumOfStars(entity.getGivenStars().size());

        dto.setOwnerName(ownerName);

        List<TrackPointDto> pointsDto = new ArrayList<>();
        for (int i = 0; i<entity.getPoints().size(); i++) {
            pointsDto.add(pointMapper.toDto(entity.getPoints().get(i)));
        }
        dto.setPoints(pointsDto);

        List<String> whitelist = new ArrayList<>();
        for (UserProfile profile : entity.getWhitelistedProfiles()) {
            whitelist.add(profile.getUsername());
        }
        dto.setWhitelist(whitelist);

        return dto;
    }

    public UserTrack toNewEntity(UserTrackDto dto, Integer ownerId) {
        if (dto == null) {
            return null;
        }

        UserTrack entity = new UserTrack();

        entity.setId(null); // id staze se dinamicki dodijeli, zato ostaje null
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

    public UserTrack updateEntity(UserTrackDto dto, UserTrack entity) {
        if (dto == null) {
            return null;
        }

        // id staze se nakon prvotnog stvaranja ne dira
        entity.setName(dto.getName());
        // datum se nakon prvotnog stvaranja ne dira
        // min i max staze se nakon prvotnog stvaranja ne mijenjaju
        entity.setVisibility(dto.getVisibility());

        // ownerId se nakon prvotnog stvaranja ne dira

        return entity;
    }
}
