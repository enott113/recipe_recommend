package com.example.recipe_recommend.service;

import com.example.recipe_recommend.dto.CrawledIngredientDto;
import com.example.recipe_recommend.dto.CrawledRecipeDto;
import com.example.recipe_recommend.dto.RecipeListResponse;
import com.example.recipe_recommend.dto.RecipeRecommendResponse;
import com.example.recipe_recommend.dto.RecipeResponse;
import com.example.recipe_recommend.dto.RecipeSearchResponse;
import com.example.recipe_recommend.entity.Recipe;
import com.example.recipe_recommend.entity.RecipeIngredient;
import com.example.recipe_recommend.entity.UserIngredient;
import com.example.recipe_recommend.repository.RecipeIngredientRepository;
import com.example.recipe_recommend.repository.RecipeRepository;
import com.example.recipe_recommend.repository.UserIngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecipeService {

  private final RecipeRepository recipeRepository;
  private final RecipeIngredientRepository recipeIngredientRepository;
  private final RecipeCrawlerService crawlerService;
  private final UserIngredientRepository userIngredientRepository;

  public RecipeResponse search(String keyword) {

    Recipe recipe = recipeRepository
        .findByRecipeName(keyword)
        .orElse(null);

    if (recipe != null) {
      return new RecipeResponse(
          recipe.getId(),
          recipe.getRecipeName(),
          recipe.getThumbnailUrl(),
          recipe.getRecipeText()
      );
    }

    CrawledRecipeDto crawled = crawlerService.crawlRecipe(keyword);

    Recipe newRecipe = Recipe.builder()
        .recipeName(crawled.recipeName())
        .sourceUrl(crawled.sourceUrl())
        .thumbnailUrl(crawled.thumbnailUrl())
        .recipeText(crawled.recipeText())
        .build();

    recipeRepository.save(newRecipe);

    for (CrawledIngredientDto ingredient : crawled.ingredients()) {
      RecipeIngredient recipeIngredient = RecipeIngredient.builder()
          .recipe(newRecipe)
          .ingredientName(ingredient.name())
          .amount(ingredient.amount())
          .build();

      recipeIngredientRepository.save(recipeIngredient);
    }

    return new RecipeResponse(
        newRecipe.getId(),
        newRecipe.getRecipeName(),
        newRecipe.getThumbnailUrl(),
        newRecipe.getRecipeText()
    );
  }

  public List<RecipeListResponse> getAllRecipes() {

    return recipeRepository.findAll()
        .stream()
        .map(recipe -> {

          List<String> ingredients =
              recipeIngredientRepository
                  .findByRecipeId(recipe.getId())
                  .stream()
                  .map(RecipeIngredient::getIngredientName)
                  .toList();

          List<String> steps =
              recipe.getRecipeText() == null
                  ? List.of()
                  : Arrays.stream(
                      recipe.getRecipeText().split("\\n")
                  ).toList();

          return new RecipeListResponse(
              recipe.getId(),
              recipe.getRecipeName(),
              "기타",
              ingredients,
              steps
          );
        })
        .toList();
  }

  public List<RecipeSearchResponse> searchByIngredients(
      List<String> ingredients
  ) {
    return recipeRepository.searchByIngredients(ingredients);
  }

  public List<RecipeRecommendResponse> recommend(UUID userId) {
    return recipeRepository.recommendRecipes(userId);
  }

  public List<RecipeRecommendResponse> recommendWithCrawling(UUID userId) {

    List<RecipeRecommendResponse> recommended =
        recipeRepository.recommendRecipes(userId);

    if (!recommended.isEmpty()) {
      return recommended;
    }

    List<UserIngredient> userIngredients =
        userIngredientRepository.findByUserId(userId);

    for (UserIngredient userIngredient : userIngredients) {

      CrawledRecipeDto crawled =
          crawlerService.crawlRecipe(
              userIngredient.getIngredient()
          );

      Recipe recipe = Recipe.builder()
          .recipeName(crawled.recipeName())
          .sourceUrl(crawled.sourceUrl())
          .thumbnailUrl(crawled.thumbnailUrl())
          .recipeText(crawled.recipeText())
          .build();

      recipeRepository.save(recipe);

      for (CrawledIngredientDto ingredient : crawled.ingredients()) {

        RecipeIngredient recipeIngredient =
            RecipeIngredient.builder()
                .recipe(recipe)
                .ingredientName(ingredient.name())
                .amount(ingredient.amount())
                .build();

        recipeIngredientRepository.save(recipeIngredient);
      }
    }

    return recipeRepository.recommendRecipes(userId);
  }
}