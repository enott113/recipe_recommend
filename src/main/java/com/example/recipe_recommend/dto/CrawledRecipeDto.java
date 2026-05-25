package com.example.recipe_recommend.dto;

import java.util.List;

public record CrawledRecipeDto(
    String recipeName,
    String sourceUrl,
    String thumbnailUrl,
    String recipeText,
    List<CrawledIngredientDto> ingredients
) {
}