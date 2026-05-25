package com.example.recipe_recommend.dto;

public record LoginRequest(
    String email,
    String password
) {
}