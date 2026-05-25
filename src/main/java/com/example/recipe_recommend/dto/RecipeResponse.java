package com.example.recipe_recommend.dto;

public record RecipeResponse(

    Long id,

    String recipeName,

    String thumbnailUrl,

    String recipeText

) {
}