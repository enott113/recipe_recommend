package com.example.recipe_recommend.dto;

public record RecipeSearchResponse(
    Long recipeId,
    String recipeName,
    String thumbnailUrl,
    Long matchedCount
) {
}