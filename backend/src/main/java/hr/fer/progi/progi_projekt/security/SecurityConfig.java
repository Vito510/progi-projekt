package hr.fer.progi.progi_projekt.security;

import hr.fer.progi.progi_projekt.service.UserProfileService;
import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Autowired
    private UserProfileService userProfileService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                        .oauth2Login(oauth2 -> oauth2
                                .successHandler((request, response, authentication) -> {

                                    OAuth2User user = (OAuth2User) authentication.getPrincipal();
                                    String userEmail = user.getAttribute("email");
                                    System.out.println(userEmail+" logged in");
                                    JwtUtil jwtUtil = new JwtUtil();
                                    String token = jwtUtil.generateToken(userEmail);


                                    if (userProfileService.userExistsByEmail(userEmail)) {
                                        // korisnik vec postoji
                                        response.sendRedirect(frontendUrl+"/login-success?token=" + token);
                                    } else {
                                        // daj da kreira username i dodaj u bazu
                                        response.sendRedirect(frontendUrl+"/register?token=" + token);
                                    }


                                })
                        )                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl(frontendUrl)
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);;

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin(frontendUrl);
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}