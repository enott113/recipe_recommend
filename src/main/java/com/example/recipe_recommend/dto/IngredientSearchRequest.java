package com.example.recipe_recommend.dto;

import java.util.List;

public record IngredientSearchRequest(
    List<String> ingredients
) {
}