package com.specno.project_manager_emmanuel.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGatewayConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r
                .path("/user-service/**")
                .uri("lb://USER-SERVICE"))

            .route("project-service", r -> r
                .path("/project-service/**")
                .uri("lb://PROJECT-SERVICE"))

            // Route OpenAPI documentation requests correctly
            .route("openapi-user-service", r -> r
                .path("/v3/api-docs/user-service")
                .filters(f -> f.rewritePath("/v3/api-docs/user-service", "/v3/api-docs"))
                .uri("http://localhost:8081"))

            .route("openapi-project-service", r -> r
                .path("/v3/api-docs/project-service")
                .filters(f -> f.rewritePath("/v3/api-docs/project-service", "/v3/api-docs"))
                .uri("http://localhost:8082"))

            .build();
    }
}
