package hr.fer.progi.progi_projekt.dto;

import java.time.LocalDate;
import java.util.List;

import hr.fer.progi.progi_projekt.model.enums.TrackVisibility;

public class UserTrackDto {
    private Integer id;
    private String name;
    private int numOfStars;
    private TrackVisibility visibility;
    private String ownerName;
    private LocalDate dateCreated;
    private Float minLat;
    private Float minLon;
    private Float maxLat;
    private Float maxLon;
    private List<TrackPointDto> points;
    private List<String> whitelist;

    @Override
    public String toString() {
        return "UserTrackDto [id=" + id + ", name=" + name + ", numOfStars=" + numOfStars + ", visibility=" + visibility
                + ", ownerName=" + ownerName + ", dateCreated=" + dateCreated + ", minLat=" + minLat + ", minLon="
                + minLon + ", maxLat=" + maxLat + ", maxLon=" + maxLon + ", points=" + points + ", whitelist="
                + whitelist + "]";
    }
    
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getNumOfStars() {
        return numOfStars;
    }
    public void setNumOfStars(int numOfStars) {
        this.numOfStars = numOfStars;
    }
    public TrackVisibility getVisibility() {
        return visibility;
    }
    public void setVisibility(TrackVisibility visibility) {
        this.visibility = visibility;
    }
    public String getOwnerName() {
        return ownerName;
    }
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
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
    public List<TrackPointDto> getPoints() {
        return points;
    }
    public void setPoints(List<TrackPointDto> points) {
        this.points = points;
    }
    public List<String> getWhitelist() {
        return whitelist;
    }
    public void setWhitelist(List<String> whitelist) {
        this.whitelist = whitelist;
    }
}
