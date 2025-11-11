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
                                .successHandler((request, response, authentication) -> {
                                    response.sendRedirect("https://planinarko.onrender.com/login-success");
                                })
                        )                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("https://planinarko.onrender.com")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
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