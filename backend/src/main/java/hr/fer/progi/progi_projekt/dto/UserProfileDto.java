package hr.fer.progi.progi_projekt.dto;

import hr.fer.progi.progi_projekt.model.enums.Role;

public class UserProfileDto {
    private String username;
    private String email;
    private Role role;

    @Override
    public String toString() {
        return "UserProfileDto [username=" + username + ", email=" + email + ", role=" + role + "]";
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
}
