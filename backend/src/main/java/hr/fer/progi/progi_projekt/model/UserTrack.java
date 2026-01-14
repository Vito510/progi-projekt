package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.*;

import java.text.DateFormat;
import java.util.List;

@Entity
@Table(name = "paths")
public class UserTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(name = "pathid")
    private Long id;

    @Column(name = "pathname", nullable = false)
    private String name;
    
    @Column(name = "UserID", nullable = false)
    private Long ownerId;

    @Column(name = "dateCreated", nullable = true)
    private DateFormat dateCreated;

    @Column(name = "visibility", nullable = false)
    private String visibility;

    @Column(name = "miny", nullable = true)
    private Float minLat;

    @Column(name = "minx", nullable = true)
    private Float minLon;

    @Column(name = "maxy", nullable = true)
    private Float maxLat;

    @Column(name = "maxx", nullable = true)
    private Float maxLon;

    private List<String> whitelist;

    @ElementCollection
    private List<TrackPoint> points;

    @Override
    public String toString() {
        return "UserTrack [id=" + id + ", name=" + name + ", ownerId=" + ownerId + ", dateCreated=" + dateCreated
                + ", visibility=" + visibility + ", minLat=" + minLat + ", minLon=" + minLon + ", maxLat=" + maxLat
                + ", maxLon=" + maxLon + ", whitelist=" + whitelist + ", points=" + points + "]";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    public String getVisibility() {
        return visibility;
    }
    
    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
    
    public DateFormat getDateCreated() {
        return dateCreated;
    }
    
    public void setDateCreated(DateFormat dateCreated) {
        this.dateCreated = dateCreated;
    }
    
    public Float getMinLat() {
        return minLat;
    }

    public void setMinLat(Float minLat) {
        this.minLat = minLat;
    }

    public Float getMinLon() {
        return minLon;
    }

    public void setMinLon(Float minLon) {
        this.minLon = minLon;
    }

    public Float getMaxLat() {
        return maxLat;
    }

    public void setMaxLat(Float maxLat) {
        this.maxLat = maxLat;
    }

    public Float getMaxLon() {
        return maxLon;
    }

    public void setMaxLon(Float maxLon) {
        this.maxLon = maxLon;
    }

    public List<String> getWhitelist() {
        return whitelist;
    }

    public void setWhitelist(List<String> whitelist) {
        this.whitelist = whitelist;
    }

    public List<TrackPoint> getPoints() {
        return points;
    }

    public void setPoints(List<TrackPoint> points) {
        this.points = points;
    }
 
}
