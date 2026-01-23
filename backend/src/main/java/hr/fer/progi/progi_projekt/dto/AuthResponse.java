package hr.fer.progi.progi_projekt.dto;

import hr.fer.progi.progi_projekt.model.enums.Role;

public class AuthResponse {
    private boolean authenticated = false;
    private String name;
    private String email;
    private Role role;

    public AuthResponse(){
    }
    public AuthResponse(boolean authenticated, String name, String email, Role role) {
        this.authenticated = authenticated;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }
    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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
