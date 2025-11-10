package hr.fer.progi.progi_projekt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/me").authenticated()
                    .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                    .defaultSuccessUrl("https://planinarko.onrender.com", true))
                .logout(logout -> logout
                    .logoutUrl("/logout")               // endpoint za logout
                    .logoutSuccessUrl("https://planinarko.onrender.com")              // redirect na FE home
                    .invalidateHttpSession(true)        // uništi sesiju
                    .clearAuthentication(true)          // očisti auth
                    .deleteCookies("JSESSIONID")        // izbriši cookie
                );

        return http.build();
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
