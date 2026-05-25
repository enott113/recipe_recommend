package com.example.recipe_recommend.dto;

public record SignupRequest(
    String email,
    String password,
    String nickname
) {
}