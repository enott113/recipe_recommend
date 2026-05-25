package com.example.recipe_recommend.repository;

import com.example.recipe_recommend.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientRepository
    extends JpaRepository<RecipeIngredient, Long> {

  List<RecipeIngredient> findByRecipeId(Long recipeId);
}