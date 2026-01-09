package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.text.DateFormat;
import java.util.List;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;

@Entity
@Component
public class UserTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(name = "trackid")
    private Long id;
    private String name;
    private String owner;
    private DateFormat dateCreated;
    private TrackVisibility visibility;
    private int stars;
    private int minLat;
    private int minLon;
    private int maxLat;
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

    public TrackVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(TrackVisibility availability) {
        this.visibility = availability;
    }

    public int getStars() {
        return stars;
    }

    public void increaseStars() {
        this.stars++;
    }

    public void decreaseStars() {
        if(this.stars>0)
            this.stars--;
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
