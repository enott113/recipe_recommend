package com.example.recipe_recommend.controller;

import com.example.recipe_recommend.dto.LoginRequest;
import com.example.recipe_recommend.dto.SignupRequest;
import com.example.recipe_recommend.dto.UserResponse;
import com.example.recipe_recommend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/signup")
  public UserResponse signup(@RequestBody SignupRequest request) {
    return authService.signup(request);
  }

  @PostMapping("/login")
  public UserResponse login(@RequestBody LoginRequest request) {
    return authService.login(request);
  }
}