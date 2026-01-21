package hr.fer.progi.progi_projekt.mapper;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.dto.UserProfileDto;
import hr.fer.progi.progi_projekt.model.UserProfile;
import hr.fer.progi.progi_projekt.model.enums.Role;

@Component
public class UserProfileMapper {
    public UserProfileDto toDto(UserProfile userProfile) {
        if (userProfile == null) {
            return null;
        }

        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(userProfile.getUsername());
        dto.setEmail(userProfile.getEmail());
        dto.setRole(userProfile.getRole());

        return dto;
    }

    public UserProfile toNewEntity(UserProfileDto dto) {
        if (dto == null) {
            return null;
        }

        UserProfile entity = new UserProfile();

        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setRole(Role.USER);

        return entity;
    }

    public UserProfile updateEntity(UserProfileDto dto, UserProfile entity) {
        if (dto == null) {
            return null;
        }

        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setRole(Role.USER);

        return entity;
    }
}
