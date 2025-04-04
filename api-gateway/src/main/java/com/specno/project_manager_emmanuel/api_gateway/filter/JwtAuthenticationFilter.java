package com.specno.project_manager_emmanuel.api_gateway.filter;

import com.specno.project_manager_emmanuel.api_gateway.security.JwtTokenValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    @Autowired
    private JwtTokenValidator jwtTokenValidator;

    private List<String> openApiEndpoints = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/swagger-ui",
            "/v3/api-docs"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // Skip authentication for open endpoints
        if (isOpenEndpoint(request.getURI().getPath())) {
            return chain.filter(exchange);
        }

        // Check for Authorization header
        if (!request.getHeaders().containsKey("Authorization")) {
            return onError(exchange, "No Authorization header", HttpStatus.UNAUTHORIZED);
        }

        // Get token from header
        String authHeader = request.getHeaders().getOrEmpty("Authorization").get(0);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Invalid Authorization header format", HttpStatus.UNAUTHORIZED);
        }

        // Extract and validate token
        String token = authHeader.substring(7);
        if (!jwtTokenValidator.validateToken(token)) {
            return onError(exchange, "Invalid or expired JWT token", HttpStatus.UNAUTHORIZED);
        }

        // Add user info to request headers for downstream services
        String username = jwtTokenValidator.extractUsername(token);
        String roles = jwtTokenValidator.extractRoles(token);
        String secret = jwtTokenValidator.secret();
        ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-Auth-User", username)
                .header("X-Gateway-Secret", secret)
                .header("X-Auth-Roles", roles)
                .build();

        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    private boolean isOpenEndpoint(String path) {
        return openApiEndpoints.stream().anyMatch(endpoint -> path.startsWith(endpoint));
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }
}