package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.model.enums.RouteAvailability;

@Entity
@Component
public class UserRoute {
    @Id
    private Long id;
    private Long ownerId;
    private String routeName;
    private RouteAvailability availability;
    private String path;
    private int stars;

    public Long getId() {
        return id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public RouteAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(RouteAvailability availability) {
        this.availability = availability;
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
 
}
