package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paths")
public class Track {

    @Id
    @Column(name = "pathid")
    private Long id;

    @Column(name = "pathname", nullable = false)
    private String name;

    @Column(name = "visibility", nullable = false)
    private String visibility;

    @Column(name = "miny", nullable = false)
    private Double minLat;

    @Column(name = "minx", nullable = false)
    private Double minLon;

    @Column(name = "maxy", nullable = false)
    private Double maxLat;

    @Column(name = "maxx", nullable = false)
    private Double maxLon;

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

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public Double getMinLat() {
        return minLat;
    }

    public void setMinLat(Double minLat) {
        this.minLat = minLat;
    }

    public Double getMinLon() {
        return minLon;
    }

    public void setMinLon(Double minLon) {
        this.minLon = minLon;
    }

    public Double getMaxLat() {
        return maxLat;
    }

    public void setMaxLat(Double maxLat) {
        this.maxLat = maxLat;
    }

    public Double getMaxLon() {
        return maxLon;
    }

    public void setMaxLon(Double maxLon) {
        this.maxLon = maxLon;
    }
}