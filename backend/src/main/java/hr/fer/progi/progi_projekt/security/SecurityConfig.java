package hr.fer.progi.progi_projekt.security;

import hr.fer.progi.progi_projekt.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                        .oauth2Login(oauth2 -> oauth2
                                .successHandler((request, response, authentication) -> {

                                    String userEmail = authentication.getName();
                                    System.out.println(userEmail);
                                    Cookie cookie = createCookie(userEmail);
                                    response.addCookie(cookie);

                                    response.sendRedirect("https://planinarko.onrender.com/login-success");
                                })
                        )                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("https://planinarko.onrender.com")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);;

        return http.build();
    }

    private static Cookie createCookie(String userEmail) {
        JwtUtil jwtUtil = new JwtUtil();
        String token = jwtUtil.generateToken(userEmail);

        Cookie cookie = new Cookie("jwt", token);
//        cookie.setHttpOnly(true);
//        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 10);
        cookie.setAttribute("SameSite", "None");
        return cookie;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("https://planinarko.onrender.com");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}