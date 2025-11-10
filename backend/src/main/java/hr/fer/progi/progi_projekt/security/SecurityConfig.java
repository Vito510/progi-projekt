package hr.fer.progi.progi_projekt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/me").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2Login()
                .and()
                .logout(logout -> logout
                        .logoutUrl("/logout")               // endpoint za logout
                        .logoutSuccessUrl("/")              // redirect na FE home
                        .invalidateHttpSession(true)        // uništi sesiju
                        .clearAuthentication(true)          // očisti auth
                        .deleteCookies("JSESSIONID")        // izbriši cookie
                );

        return http.build();
    }
}
