package hr.fer.progi.progi_projekt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import hr.fer.progi.progi_projekt.dto.TopTrackDto;
import hr.fer.progi.progi_projekt.model.UserTrack;

@Repository
public interface UserTrackRepository extends JpaRepository<UserTrack, Long>{
    Optional<UserTrack> findByName(String name);

    @Query(value = """
        SELECT
            p.pathid AS id,
            p.pathname AS name,
            u.username AS owner,
            p.visibility AS visibility,
            COUNT(s.userid) AS stars,
            p.miny AS minLat,
            p.minx AS minLon,
            p.maxy AS maxLat,
            p.maxx AS maxLon
        FROM paths p
        JOIN users u ON u.userid = p.userid
        LEFT JOIN stars s ON s.pathid = p.pathid
        WHERE p.visibility = 'PUBLIC'
        GROUP BY p.pathid, u.username
        ORDER BY stars DESC
        LIMIT 10
        """, nativeQuery = true)
    List<TopTrackDto> findTop10Tracks();
}
