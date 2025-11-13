package hr.fer.progi.progi_projekt.model;

import org.springframework.stereotype.Component;

@Component
public class AuthResponse {
    private String token;
    private UserProfile userProfile;
    private String requestToken;
    private int expires_in;

    public String getToken() {
        return token;
    }

    public String getRequestToken() {
        return requestToken;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public int getExpires_in() {
        return expires_in;
    }
    
}
