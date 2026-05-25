package com.example.recipe_recommend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_ingredient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserIngredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String ingredient;

  private String amount;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;
}