package com.specno.project_manager_emmanuel.project_service.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @GetMapping("/my")
    public Map<String, Object> getProjects(@AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {  // Null check should be inside parentheses
            return Map.of(
                "user", "",
                "assignedProjects", List.of()
            );
        }

        String username = userDetails.getUsername();

        List<String> projects = List.of("Project A", "Project B", "Project C");

        return Map.of(
            "user", username,
            "assignedProjects", projects
        );
    }
}
