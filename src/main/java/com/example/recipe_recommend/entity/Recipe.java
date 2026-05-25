package com.example.recipe_recommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="recipe")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  private String recipeName;

  private String sourceUrl;

  private String thumbnailUrl;

  @Column(columnDefinition = "TEXT")
  private String recipeText;
}