package com.specno.project_manager_emmanuel.user_service.controller;

import com.specno.project_manager_emmanuel.user_service.security.JwtTokenUtil;
import com.specno.project_manager_emmanuel.user_service.model.LoginRequest;
import com.specno.project_manager_emmanuel.user_service.model.AuthResponse;    
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // todo: validate against the database
        String token = jwtTokenUtil.generateToken(loginRequest.getUsername(), Collections.singletonList("ROLE_USER"));
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
