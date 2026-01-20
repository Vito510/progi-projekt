package hr.fer.progi.progi_projekt.mapper;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.dto.TrackPointDto;
import hr.fer.progi.progi_projekt.model.TrackPoint;

@Component
public class TrackPointMapper {
    public TrackPointDto toDto(TrackPoint trackPoint) {
        if (trackPoint == null) return null;

        TrackPointDto dto = new TrackPointDto();
        dto.setX(trackPoint.getX());
        dto.setY(trackPoint.getY());
        dto.setZ(trackPoint.getZ());
        return dto;
    }

    public TrackPoint toEntity(TrackPointDto dto) {
        if (dto == null) return null;

        TrackPoint entity = new TrackPoint();
        entity.setX(dto.getX());
        entity.setY(dto.getY());
        entity.setZ(dto.getZ());
        return entity;
    }
}
