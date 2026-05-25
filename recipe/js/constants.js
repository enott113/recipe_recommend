const STORAGE_KEYS = {
  users: "fridge_recipe_users",
  fridge: "fridge_recipe_ingredients",
  allergies: "fridge_recipe_allergies",
};

const NO_REQUIRED_INGREDIENT = "없음";

const RECIPE_CSV_URL = "http://localhost:3000/recipes.csv";

const FALLBACK_CSV = `recipeId,recipeName,category,requiredIngredients,steps
1,김치볶음밥,밥류,"밥|김치|계란|간장|참기름","김치를 먹기 좋은 크기로 잘게 썹니다.|팬에 김치를 먼저 볶습니다.|밥과 계란을 넣고 함께 볶습니다.|간장과 참기름으로 간을 맞춥니다."
2,김치찌개,찌개류,"김치|두부|돼지고기|대파","냄비에 김치와 물을 넣고 끓입니다.|두부와 돼지고기를 넣습니다.|대파를 넣고 한 번 더 끓입니다."
3,간장계란밥,밥류,"밥|계란|간장|참기름","밥을 그릇에 담습니다.|계란을 익혀 밥 위에 올립니다.|간장과 참기름을 넣고 비빕니다."
4,참치마요덮밥,덮밥류,"밥|참치|마요네즈|김|간장","참치의 기름을 가볍게 제거합니다.|참치와 마요네즈를 섞습니다.|밥 위에 참치마요를 올립니다.|간장과 김을 곁들여 마무리합니다."
5,소고기볶음밥,밥류,"밥|소고기|양파|간장|식용유","소고기와 양파를 볶습니다.|밥을 넣고 함께 볶습니다.|간장으로 간을 맞춥니다."
6,닭고기덮밥,덮밥류,"밥|닭고기|양파|간장|설탕","닭고기와 양파를 볶습니다.|간장과 설탕으로 간을 맞춥니다.|밥 위에 올립니다."`;