package com.example.recipe_recommend.dto;

public record RecipeRecommendResponse(
    Long recipeId,
    String recipeName,
    String thumbnailUrl,
    Long matchedCount,
    Long missingCount
) {
}