package hr.fer.progi.progi_projekt.dto;

public class TrackPointDto {
    private Float x;
    private Float y;
    private Float z;

    @Override
    public String toString() {
        return "TrackPointDto [x=" + x + ", y=" + y + ", z=" + z + "]";
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
}
