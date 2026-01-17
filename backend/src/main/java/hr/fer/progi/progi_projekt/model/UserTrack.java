package hr.fer.progi.progi_projekt.model;

import java.time.LocalDate;

import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;
import jakarta.persistence.*;

@Entity
@Table(name = "paths")
public class UserTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(name = "pathid")
    private Long id;

    @Column(name = "pathname", nullable = false)
    private String name;
    
    @Column(name = "userid", nullable = false)
    private Long ownerId;

    @Column(name = "datecreated", nullable = true)
    private LocalDate dateCreated;

    @Column(name = "visibility", nullable = false)
    private TrackVisibility visibility;

    @Column(name = "miny", nullable = true)
    private Float minLat;

    @Column(name = "minx", nullable = true)
    private Float minLon;

    @Column(name = "maxy", nullable = true)
    private Float maxLat;

    @Column(name = "maxx", nullable = true)
    private Float maxLon;

    public UserTrack() {
    }

    public UserTrack(Long id, String name, Long ownerId, LocalDate dateCreated, TrackVisibility visibility, Float minLat,
            Float minLon, Float maxLat, Float maxLon) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.dateCreated = dateCreated;
        this.visibility = visibility;
        this.minLat = minLat;
        this.minLon = minLon;
        this.maxLat = maxLat;
        this.maxLon = maxLon;
    }

    @Override
    public String toString() {
        return "UserTrack [id=" + id + ", name=" + name + ", ownerId=" + ownerId + ", dateCreated=" + dateCreated
                + ", visibility=" + visibility + ", minLat=" + minLat + ", minLon=" + minLon + ", maxLat=" + maxLat
                + ", maxLon=" + maxLon + "]";
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
    
    public TrackVisibility getVisibility() {
        return visibility;
    }
    
    public void setVisibility(TrackVisibility visibility) {
        this.visibility = visibility;
    }
    
    public LocalDate getDateCreated() {
        return dateCreated;
    }
    
    public void setDateCreated(LocalDate dateCreated) {
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
}
