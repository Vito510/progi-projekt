package hr.fer.progi.progi_projekt.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.model.enums.Role;

@Entity
@Table(name="users")
@Component
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(name = "userid")
    private Integer id;

    private String username;
    private String email;
    private Role role;

    @ManyToMany(mappedBy = "givenStars")
    private Set<UserTrack> starredTracks = new HashSet<>();

    @ManyToMany(mappedBy = "whitelistedProfiles")
    private Set<UserTrack> grantedAccessTracks = new HashSet<>();

    public UserProfile() {
    }
    public UserProfile(String username, String email, Role role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }
    
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public Set<UserTrack> getStarredTracks() {
        return starredTracks;
    }
    public void setStarredTracks(Set<UserTrack> starredTracks) {
        this.starredTracks = starredTracks;
    }
    public Set<UserTrack> getGrantedAccessTracks() {
        return grantedAccessTracks;
    }
    public void setGrantedAccessTracks(Set<UserTrack> grantedAccessTracks) {
        this.grantedAccessTracks = grantedAccessTracks;
    }
}
