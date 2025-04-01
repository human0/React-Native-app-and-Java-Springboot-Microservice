package com.specno.project_manager_emmanuel.project_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI projectServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Project Service API")
                        .description("Project management operations")
                        .version("v1")
                        .contact(new Contact()
                                .name("Specno Project Management")
                                .url("https://github.com/human0/SpecManager")));
    }
}