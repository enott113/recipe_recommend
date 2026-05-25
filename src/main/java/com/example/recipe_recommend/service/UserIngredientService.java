package com.example.recipe_recommend.service;

import com.example.recipe_recommend.dto.IngredientRequest;
import com.example.recipe_recommend.entity.User;
import com.example.recipe_recommend.entity.UserIngredient;
import com.example.recipe_recommend.repository.UserIngredientRepository;
import com.example.recipe_recommend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserIngredientService {

  private final UserRepository userRepository;
  private final UserIngredientRepository userIngredientRepository;

  public List<UserIngredient> getIngredients(UUID userId) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    return userIngredientRepository.findByUser(user);
  }

  public UserIngredient addIngredient(UUID userId, IngredientRequest request) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    UserIngredient ingredient = UserIngredient.builder()
        .user(user)
        .ingredient(request.ingredient())
        .amount(request.amount())
        .build();

    return userIngredientRepository.save(ingredient);
  }

  public void deleteIngredient(Long ingredientId) {
    userIngredientRepository.deleteById(ingredientId);
  }
}