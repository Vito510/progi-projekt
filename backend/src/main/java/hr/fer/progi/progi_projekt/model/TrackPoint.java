package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class TrackPoint {
    private Float x;
    private Float y;
    private Float z;

    public TrackPoint() {
    }

    public TrackPoint(Float x, Float y, Float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public Float getX() {
        return x;
    }
    public void setX(Float x) {
        this.x = x;
    }
    public Float getY() {
        return y;
    }
    public void setY(Float y) {
        this.y = y;
    }
    public Float getZ() {
        return z;
    }
    public void setZ(Float z) {
        this.z = z;
    }
    @Override
    public String toString() {
        return "TrackPoint [x=" + x + ", y=" + y + ", z=" + z + "]";
    }

    
}
