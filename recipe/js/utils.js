function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeUsers(users) {
  if (!Array.isArray(users)) return [];

  return users.filter(
    (user) =>
      user &&
      typeof user === "object" &&
      typeof user.id === "string" &&
      typeof user.password === "string"
  );
}

function createId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return String(Date.now());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseRecipeCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex] || "";
    });

    return {
      recipeId: Number(row.recipeId) || index + 1,
      recipeName: row.recipeName || "이름 없는 레시피",
      category: row.category || "기타",
      requiredIngredients: row.requiredIngredients
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean),
      steps: row.steps
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  });
}

async function fetchRecipeCsv() {
  try {
    const response = await fetch(RECIPE_CSV_URL);

    if (!response.ok) {
      throw new Error("CSV 응답을 불러오지 못했습니다.");
    }

    const csvText = await response.text();
    const recipes = parseRecipeCsv(csvText);

    if (recipes.length === 0) {
      throw new Error("CSV 안에 레시피 데이터가 없습니다.");
    }

    state.recipeData = recipes;
    state.csvMessage = "백엔드 CSV 파일에서 레시피 데이터를 불러왔습니다.";
    state.isFallback = false;
  } catch {
    state.recipeData = parseRecipeCsv(FALLBACK_CSV);
    state.csvMessage =
      "백엔드 CSV 연결 전입니다. 현재는 예시 CSV 데이터로 미리보기 중입니다.";
    state.isFallback = true;
  }

  render();
}

function getDatasetIngredients(recipes) {
  const ingredients = recipes.flatMap((recipe) => recipe.requiredIngredients);

  return Array.from(new Set(ingredients)).sort((a, b) =>
    a.localeCompare(b, "ko")
  );
}

function getSimilarIngredients(inputValue, datasetIngredients) {
  const keyword = inputValue.trim();

  if (!keyword) return [];

  return datasetIngredients
    .filter(
      (ingredient) =>
        ingredient.includes(keyword) || keyword.includes(ingredient)
    )
    .slice(0, 8);
}

function calculateRecommendedRecipes() {
  const fridgeNames = state.fridgeItems.map((item) => item.name);
  const allergyNames = state.allergies.map((item) => item.name);

  return state.recipeData
    .filter((recipe) => {
      const hasAllergyIngredient = recipe.requiredIngredients.some(
        (ingredient) => allergyNames.includes(ingredient)
      );

      if (hasAllergyIngredient) return false;

      if (state.selectedIngredient === NO_REQUIRED_INGREDIENT) {
        return true;
      }

      return recipe.requiredIngredients.includes(state.selectedIngredient);
    })
    .map((recipe) => {
      const ownedIngredients = recipe.requiredIngredients.filter((ingredient) =>
        fridgeNames.includes(ingredient)
      );

      const missingIngredients = recipe.requiredIngredients.filter(
        (ingredient) => !fridgeNames.includes(ingredient)
      );

      const matchRate = Math.round(
        (ownedIngredients.length / recipe.requiredIngredients.length) * 100
      );

      return {
        ...recipe,
        matchRate,
        availableType:
          missingIngredients.length === 0 ? "바로 가능" : "추가 재료 필요",
        ownedIngredients,
        missingIngredients,
      };
    })
    .sort(
      (a, b) =>
        b.matchRate - a.matchRate ||
        a.missingIngredients.length - b.missingIngredients.length
    );
}

function renderWithFocus(inputId) {
  render();

  requestAnimationFrame(() => {
    const input = document.getElementById(inputId);

    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });
}