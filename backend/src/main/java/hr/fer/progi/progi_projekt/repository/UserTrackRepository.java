package hr.fer.progi.progi_projekt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hr.fer.progi.progi_projekt.model.UserTrack;

@Repository
public interface UserTrackRepository extends JpaRepository<UserTrack, Long>{
    Optional<UserTrack> findByName(String name);
}
