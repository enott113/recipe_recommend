package com.example.recipe_recommend.repository;

import com.example.recipe_recommend.entity.User;
import com.example.recipe_recommend.entity.UserIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserIngredientRepository
    extends JpaRepository<UserIngredient, Long> {

  List<UserIngredient> findByUser(User user);

  List<UserIngredient> findByUserId(UUID userId);
}