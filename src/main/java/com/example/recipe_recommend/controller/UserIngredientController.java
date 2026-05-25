package com.example.recipe_recommend.controller;

import com.example.recipe_recommend.dto.IngredientRequest;
import com.example.recipe_recommend.entity.UserIngredient;
import com.example.recipe_recommend.service.UserIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class UserIngredientController {

  private final UserIngredientService userIngredientService;

  @GetMapping("/{userId}")
  public List<UserIngredient> getIngredients(@PathVariable UUID userId) {
    return userIngredientService.getIngredients(userId);
  }

  @PostMapping("/{userId}")
  public UserIngredient addIngredient(
      @PathVariable UUID userId,
      @RequestBody IngredientRequest request
  ) {
    return userIngredientService.addIngredient(userId, request);
  }

  @DeleteMapping("/{ingredientId}")
  public String deleteIngredient(@PathVariable Long ingredientId) {
    userIngredientService.deleteIngredient(ingredientId);
    return "삭제 완료";
  }
}