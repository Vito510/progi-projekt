package hr.fer.progi.progi_projekt.model;

import java.util.List;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import hr.fer.progi.progi_projekt.model.enums.Role;

@Entity
@Table(name="users")
@Component
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    @Column(name = "userid")
    private Long id;

    private String username;
    private String email;
    private Role role;

    @OneToMany
    private List<UserRoute> userRoutes;
    @OneToMany
    private List<UserRoute> starredRoutes;

    public UserProfile() {
    }
    public UserProfile(String username, String email, Role role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
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
    public List<UserRoute> getUserRoutes() {
        return userRoutes;
    }
    public Role getRole() {
        return role;
    }
    public List<UserRoute> getStarredRoutes() {
        return starredRoutes;
    }
}
