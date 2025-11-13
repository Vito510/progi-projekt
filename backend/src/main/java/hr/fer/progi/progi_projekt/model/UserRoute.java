package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.model.enums.RouteAvailability;

@Entity
@Component
public class UserRoute {
    @Id
    private int id;
    private int ownerId;
    private RouteAvailability availability;
    // objekt staze/patha
    private int stars;

    public int getId() {
        return id;
    }

    public int getOwnerId() {
        return ownerId;
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
