package com.specno.project_manager_emmanuel.user_service.controller;

import com.specno.project_manager_emmanuel.user_service.security.JwtTokenUtil;
import com.specno.project_manager_emmanuel.user_service.model.LoginRequest;
import com.specno.project_manager_emmanuel.user_service.model.AuthResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_ShouldReturnToken_WhenValidRequest() {
        // Arrange
        String testUsername = "testuser";
        String expectedToken = "mocked-jwt-token";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testUsername);
        loginRequest.setPassword("password123");

        when(jwtTokenUtil.generateToken(testUsername, Collections.singletonList("ROLE_USER"))).thenReturn(expectedToken);

        // Act
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(200, responseEntity.getStatusCodeValue());

        AuthResponse authResponse = (AuthResponse) responseEntity.getBody();
        assertNotNull(authResponse);
        assertEquals(expectedToken, authResponse.getToken());

        verify(jwtTokenUtil, times(1)).generateToken(testUsername, Collections.singletonList("ROLE_USER"));
    }
}
