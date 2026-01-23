package hr.fer.progi.progi_projekt.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "points")
public class TrackPoint {
    @EmbeddedId
    private PointId id;

    @Column(name = "xcoord")
    private Float x;

    @Column(name = "ycoord")
    private Float y;

    @Column(name = "zcoord")
    private Float z;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    @JoinColumn(name = "pathid")
    private UserTrack track;

    @Embeddable
    public static class PointId implements Serializable {
        @Column(name = "pathid")
        private Integer trackId;

        @Column(name = "orderpoint")
        private int orderPoint;

        public PointId() {
        }

        public Integer getTrackId() {
            return trackId;
        }
        public void setTrackId(Integer trackId) {
            this.trackId = trackId;
        }
        public int getOrderPoint() {
            return orderPoint;
        }
        public void setOrderPoint(int order) {
            this.orderPoint = order;
        }

        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + ((trackId == null) ? 0 : trackId.hashCode());
            result = prime * result + orderPoint;
            return result;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            PointId other = (PointId) obj;
            if (trackId == null) {
                if (other.trackId != null)
                    return false;
            } else if (!trackId.equals(other.trackId))
                return false;
            if (orderPoint != other.orderPoint)
                return false;
            return true;
        }
    }

    public TrackPoint() {
    }

    public TrackPoint(Float x, Float y, Float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    @Override
    public String toString() {
        return "TrackPoint [x=" + x + ", y=" + y + ", z=" + z + "]";
    }

    public Integer getTrackId() {
        return id != null ? id.getTrackId() : null;
    }

    public void setTrackId(Integer trackId) {
        if (id == null) id = new PointId();
        id.setTrackId(trackId);
    }

    public int getOrderPoint() {
        return id != null ? id.getOrderPoint() : 0;
    }

    public void setOrderPoint(int orderPoint) {
        if (id == null) id = new PointId();
        id.setOrderPoint(orderPoint);
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

    public UserTrack getTrack() {
        return track;
    }

    public void setTrack(UserTrack track) {
        this.track = track;
    }  
}
