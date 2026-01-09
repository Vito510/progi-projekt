package hr.fer.progi.progi_projekt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hr.fer.progi.progi_projekt.model.UserTrack;

@Repository
public interface TrackRepository extends JpaRepository<UserTrack, Long>{

}
