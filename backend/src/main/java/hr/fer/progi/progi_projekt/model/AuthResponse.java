package hr.fer.progi.progi_projekt.model;

import org.springframework.stereotype.Component;

@Component
public class AuthResponse {
    private boolean authenticated = false;
    private String name;
    private String email;

    public AuthResponse(){
    }
    public AuthResponse(boolean authenticated, String name, String email) {
        this.authenticated = authenticated;
        this.name = name;
        this.email = email;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    
}
