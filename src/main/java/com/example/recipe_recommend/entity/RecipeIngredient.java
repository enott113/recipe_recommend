package com.example.recipe_recommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="recipe_ingredient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredient {

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  private String ingredientName;

  private String amount;

  @ManyToOne(fetch=FetchType.LAZY)
  @JoinColumn(name="recipe_id")
  private Recipe recipe;
}