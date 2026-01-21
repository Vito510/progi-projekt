package hr.fer.progi.progi_projekt.dto;

public interface TopTrackDto {
    Integer getId();
    String getName();
    String getOwner();
    String getVisibility();
    Integer getStars();
    Double getMinLat();
    Double getMinLon();
    Double getMaxLat();
    Double getMaxLon();
}