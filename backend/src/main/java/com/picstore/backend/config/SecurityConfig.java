package com.picstore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for H2 Console and API
                .csrf(csrf -> csrf.disable())
                // Allow frames for H2 Console
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .authorizeHttpRequests(auth -> auth
                        // Allow all requests to H2 Console
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                        // Allow all requests to our API
                        .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}