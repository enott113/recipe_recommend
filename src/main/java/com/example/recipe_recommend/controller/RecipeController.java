package com.example.recipe_recommend.controller;

import com.example.recipe_recommend.dto.IngredientSearchRequest;
import com.example.recipe_recommend.dto.RecipeListResponse;
import com.example.recipe_recommend.dto.RecipeRecommendResponse;
import com.example.recipe_recommend.dto.RecipeResponse;
import com.example.recipe_recommend.dto.RecipeSearchResponse;
import com.example.recipe_recommend.service.RecipeService;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService
      recipeService;

  @GetMapping(
      "/search"
  )
  public RecipeResponse search(

      @RequestParam
      String keyword

  ){

    return recipeService
        .search(
            keyword
        );
  }
  @GetMapping("/recommend/{userId}")
  public List<RecipeRecommendResponse> recommend(
      @PathVariable UUID userId
  ) {
    return recipeService.recommendWithCrawling(userId);
  }

  @PostMapping("/search-by-ingredients")
  public List<RecipeSearchResponse> searchByIngredients(
      @RequestBody IngredientSearchRequest request
  ) {

    return recipeService.searchByIngredients(
        request.ingredients()
    );
  }
  @GetMapping
  public List<RecipeListResponse> getAllRecipes() {
    return recipeService.getAllRecipes();
  }

}