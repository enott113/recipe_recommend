package com.example.recipe_recommend.repository;

import com.example.recipe_recommend.dto.RecipeRecommendResponse;
import com.example.recipe_recommend.dto.RecipeSearchResponse;
import com.example.recipe_recommend.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

  Optional<Recipe> findByRecipeName(String recipeName);

  @Query("""
        SELECT new com.example.recipe_recommend.dto.RecipeRecommendResponse(
            r.id,
            r.recipeName,
            r.thumbnailUrl,
            COUNT(ui.id),
            COUNT(ri.id) - COUNT(ui.id)
        )
        FROM Recipe r
        JOIN RecipeIngredient ri
            ON r.id = ri.recipe.id
        LEFT JOIN UserIngredient ui
            ON ri.ingredientName = ui.ingredient
            AND ui.user.id = :userId
        GROUP BY r.id, r.recipeName, r.thumbnailUrl
        HAVING COUNT(ri.id) - COUNT(ui.id) <= 2
        ORDER BY COUNT(ui.id) DESC
    """)
  List<RecipeRecommendResponse> recommendRecipes(
      @Param("userId") UUID userId
  );
  @Query("""
    SELECT new com.example.recipe_recommend.dto.RecipeSearchResponse(
        r.id,
        r.recipeName,
        r.thumbnailUrl,
        COUNT(ri.id)
    )
    FROM Recipe r
    JOIN RecipeIngredient ri
        ON r.id = ri.recipe.id
    WHERE ri.ingredientName IN :ingredients
    GROUP BY r.id, r.recipeName, r.thumbnailUrl
    ORDER BY COUNT(ri.id) DESC
""")
  List<RecipeSearchResponse> searchByIngredients(
      @Param("ingredients") List<String> ingredients
  );
}