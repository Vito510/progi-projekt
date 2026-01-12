package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.text.DateFormat;
import java.util.List;

@Entity
@Table(name = "paths")
public class UserTrack {
    @Id
    @Column(name = "pathid")
    private Long id;

    @Column(name = "pathname", nullable = false)
    private String name;
    
    private String owner;

    private DateFormat dateCreated;

    @Column(name = "visibility", nullable = false)
    private String visibility;

    @Column(name = "miny", nullable = false)
    private int minLat;

    @Column(name = "minx", nullable = false)
    private int minLon;

    @Column(name = "maxy", nullable = false)
    private int maxLat;

    @Column(name = "maxx", nullable = false)
    private int maxLon;

    private List<String> whitelist;

    @ElementCollection
    private List<TrackPoint> points;

    public Long getId() {
        return id;
    }

    public String getOwner() {
        return owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getMinLat() {
        return minLat;
    }

    public void setMinLat(int minLat) {
        this.minLat = minLat;
    }

    public int getMinLon() {
        return minLon;
    }

    public void setMinLon(int minLon) {
        this.minLon = minLon;
    }

    public int getMaxLat() {
        return maxLat;
    }

    public void setMaxLat(int maxLat) {
        this.maxLat = maxLat;
    }

    public int getMaxLon() {
        return maxLon;
    }

    public void setMaxLon(int maxLon) {
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
