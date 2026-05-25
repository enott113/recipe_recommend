package com.example.recipe_recommend.dto;

public record IngredientRequest(
    String ingredient,
    String amount
) {
}