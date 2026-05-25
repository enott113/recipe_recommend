package com.example.recipe_recommend.dto;

import java.util.List;

public record RecipeListResponse(
    Long recipeId,
    String recipeName,
    String category,
    List<String> requiredIngredients,
    List<String> steps
) {
}