package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class TrackPoint {
    private double x;
    private double y;
    private double z;
    
    public TrackPoint(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public double getX() {
        return x;
    }
    public void setX(double x) {
        this.x = x;
    }
    public double getY() {
        return y;
    }
    public void setY(double y) {
        this.y = y;
    }
    public double getZ() {
        return z;
    }
    public void setZ(double z) {
        this.z = z;
    }

    
}
