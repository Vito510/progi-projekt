// package hr.fer.progi.progi_projekt.repository;

// import hr.fer.progi.progi_projekt.model.Track;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;
// import hr.fer.progi.progi_projekt.dto.TopTrackDto;

// import java.util.List;

// @Repository
// public interface TrackRepository extends JpaRepository<Track, Long> {

//     @Query(value = """
//         SELECT
//             p.pathid AS id,
//             p.pathname AS name,
//             u.username AS owner,
//             p.visibility AS visibility,
//             COUNT(s.userid) AS stars,
//             p.miny AS minLat,
//             p.minx AS minLon,
//             p.maxy AS maxLat,
//             p.maxx AS maxLon
//         FROM paths p
//         JOIN users u ON u.userid = p.userid
//         LEFT JOIN stars s ON s.pathid = p.pathid
//         WHERE p.visibility = 'PUBLIC'
//         GROUP BY p.pathid, u.username
//         ORDER BY stars DESC
//         LIMIT 10
//         """, nativeQuery = true)
//     List<TopTrackDto> findTop10Tracks();
// }