package hr.fer.progi.progi_projekt.dto;

public interface TopTrackDto {
    Long getId();
    String getName();
    String getOwner();
    String getVisibility();
    Long getStars();
    Double getMinLat();
    Double getMinLon();
    Double getMaxLat();
    Double getMaxLon();
}