package com.example.recipe_recommend.service;

import com.example.recipe_recommend.dto.LoginRequest;
import com.example.recipe_recommend.dto.SignupRequest;
import com.example.recipe_recommend.dto.UserResponse;
import com.example.recipe_recommend.entity.User;
import com.example.recipe_recommend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;

  public UserResponse signup(SignupRequest request) {

    if (userRepository.existsByEmail(request.email())) {
      throw new RuntimeException("이미 존재하는 이메일입니다.");
    }

    if (userRepository.existsByNickname(request.nickname())) {
      throw new RuntimeException("이미 존재하는 닉네임입니다.");
    }

    User user = User.builder()
        .id(UUID.randomUUID())
        .email(request.email())
        .password(request.password())
        .nickname(request.nickname())
        .build();

    userRepository.save(user);

    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getNickname()
    );
  }

  public UserResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

    if (!user.getPassword().equals(request.password())) {
      throw new RuntimeException("비밀번호가 일치하지 않습니다.");
    }

    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getNickname()
    );
  }
}