package com.specno.project_manager_emmanuel.project_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;


import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class ApiGatewayPreAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String username = request.getHeader("X-Auth-User");
        String secret = request.getHeader("X-Gateway-Secret");
        String roles = request.getHeader("X-Auth-Roles");

        System.out.println("Username: " + username);
        System.out.println("Secret: " + secret);
        System.out.println("Roles: " + roles);

        if (username != null) {
            List<SimpleGrantedAuthority> authorities = authoritiesFromRoles(roles);

            UserDetails userDetails = User.withUsername(username)
                    .password("")
                    .authorities(authorities)
                    .build();

            PreAuthenticatedAuthenticationToken authentication =
                    new PreAuthenticatedAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("Authentication set: " + authentication);
        }

        filterChain.doFilter(request, response);
    }

    private  List<SimpleGrantedAuthority> authoritiesFromRoles(String roles) {
        if (roles != null && !roles.isEmpty()) {
            return Stream.of(roles.split(","))
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USER")); 
        }
    }
}
