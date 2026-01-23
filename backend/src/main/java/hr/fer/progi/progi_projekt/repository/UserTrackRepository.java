package hr.fer.progi.progi_projekt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import hr.fer.progi.progi_projekt.model.UserTrack;
import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;

@Repository
public interface UserTrackRepository extends JpaRepository<UserTrack, Integer>{
    Optional<UserTrack> findByName(String name);

    List<UserTrack> findByOwnerId(Integer ownerId);
    List<UserTrack> findByOwnerIdAndVisibility(Integer ownerId, TrackVisibility visibility);

    @Query("""
        SELECT t
        FROM UserTrack t
        LEFT JOIN t.givenStars s
        GROUP BY t
        ORDER BY COUNT(s) DESC
    """)
    List<UserTrack> findTop10ByStars(Pageable pageable);
}
