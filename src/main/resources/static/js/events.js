function handleLogin(inputId, inputPassword) {
  if (!inputId) {
    state.loginNotice = "아이디를 입력해주세요.";
    state.loginNoticeType = "warning";
    render();
    return;
  }

  if (!inputPassword) {
    state.loginNotice = "비밀번호를 입력해주세요.";
    state.loginNoticeType = "warning";
    render();
    return;
  }

  const foundUser = state.registeredUsers.find((user) => user.id === inputId);

  if (!foundUser) {
    state.loginNotice =
      "회원가입이 되어 있지 않는 사용자입니다. 회원가입을 먼저해주세요.";
    state.loginNoticeType = "warning";
    state.highlightSignup = true;
    render();
    return;
  }

  if (foundUser.password !== inputPassword) {
    state.loginNotice = "비밀번호가 일치하지 않습니다.";
    state.loginNoticeType = "warning";
    state.highlightSignup = false;
    render();
    return;
  }

  state.userId = inputId;
  state.loginNotice = "";
  state.signupNotice = "";
  state.highlightSignup = false;
  state.page = "home";
  render();
}

function handleSignup(inputId, inputPassword, passwordConfirm) {
  if (!inputId) {
    state.signupNotice = "사용할 아이디를 입력해주세요.";
    render();
    return;
  }

  if (!inputPassword) {
    state.signupNotice = "비밀번호를 입력해주세요.";
    render();
    return;
  }

  if (inputPassword.length < 4) {
    state.signupNotice = "비밀번호는 4자 이상으로 입력해주세요.";
    render();
    return;
  }

  if (inputPassword !== passwordConfirm) {
    state.signupNotice = "비밀번호 확인이 일치하지 않습니다.";
    render();
    return;
  }

  const isDuplicate = state.registeredUsers.some(
    (user) => user.id === inputId
  );

  if (isDuplicate) {
    state.signupNotice = "이미 가입된 아이디입니다. 로그인해주세요.";
    render();
    return;
  }

  state.registeredUsers.push({
    id: inputId,
    password: inputPassword,
  });

  saveToStorage(STORAGE_KEYS.users, state.registeredUsers);

  state.signupNotice = "";
  state.loginNotice = "회원가입이 완료되었습니다. 다시 로그인해주세요.";
  state.loginNoticeType = "info";
  state.highlightSignup = false;

  // 회원가입 후 로그인 화면 입력칸 비우기
  state.loginId = "";
  state.loginPassword = "";

  state.page = "login";

  state.signupId = "";
  state.signupPassword = "";
  state.passwordConfirm = "";

  render();
}

// 데이터셋에 실제로 존재하는 재료인지 확인
function isIngredientInDataset(name) {
  const datasetIngredients = getDatasetIngredients(state.recipeData);
  return datasetIngredients.includes(name);
}

function addFridgeIngredient(name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    alert("재료명을 입력해주세요.");
    return;
  }

  if (!isIngredientInDataset(trimmedName)) {
    alert(
      `"${trimmedName}"은(는) 데이터셋에 없는 재료입니다.\n유사 검색어에 표시되는 재료를 선택해주세요.`
    );
    return;
  }

  const isDuplicate = state.fridgeItems.some(
    (item) => item.name === trimmedName
  );

  if (isDuplicate) {
    alert("이미 냉장고에 등록된 재료입니다.");
    state.fridgeInput = "";
    render();
    return;
  }

  state.fridgeItems.push({
    id: createId(),
    name: trimmedName,
  });

  saveToStorage(STORAGE_KEYS.fridge, state.fridgeItems);

  state.fridgeInput = "";
  render();
}

function addAllergyIngredient(name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    alert("알러지 재료명을 입력해주세요.");
    return;
  }

  if (!isIngredientInDataset(trimmedName)) {
    alert(
      `"${trimmedName}"은(는) 데이터셋에 없는 재료입니다.\n유사 검색어에 표시되는 재료를 선택해주세요.`
    );
    return;
  }

  const isDuplicate = state.allergies.some(
    (item) => item.name === trimmedName
  );

  if (isDuplicate) {
    alert("이미 알러지에 등록된 재료입니다.");
    state.allergyInput = "";
    render();
    return;
  }

  state.allergies.push({
    id: createId(),
    name: trimmedName,
  });

  saveToStorage(STORAGE_KEYS.allergies, state.allergies);

  state.allergyInput = "";
  render();
}

app.addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.id === "loginForm") {
    handleLogin(state.loginId.trim(), state.loginPassword);
  }

  if (event.target.id === "signupForm") {
    handleSignup(
      state.signupId.trim(),
      state.signupPassword,
      state.passwordConfirm
    );
  }

  if (event.target.id === "fridgeForm") {
    addFridgeIngredient(state.fridgeInput);
  }

  if (event.target.id === "allergyForm") {
    addAllergyIngredient(state.allergyInput);
  }
});

app.addEventListener("compositionstart", (event) => {
  if (event.target.id === "fridgeInput") {
    state.isComposingFridge = true;
  }

  if (event.target.id === "allergyInput") {
    state.isComposingAllergy = true;
  }
});

app.addEventListener("compositionend", (event) => {
  if (event.target.id === "fridgeInput") {
    state.isComposingFridge = false;
    state.fridgeInput = event.target.value;
    renderWithFocus("fridgeInput");
  }

  if (event.target.id === "allergyInput") {
    state.isComposingAllergy = false;
    state.allergyInput = event.target.value;
    renderWithFocus("allergyInput");
  }
});

app.addEventListener("input", (event) => {
  const { id, value } = event.target;

  if (id === "loginId") state.loginId = value;
  if (id === "loginPassword") state.loginPassword = value;

  if (id === "signupId") state.signupId = value;
  if (id === "signupPassword") state.signupPassword = value;
  if (id === "passwordConfirm") state.passwordConfirm = value;

  if (id === "fridgeInput") {
    state.fridgeInput = value;

    // 한글 조합 중에는 render()를 실행하지 않음
    if (state.isComposingFridge || event.isComposing) {
      return;
    }

    renderWithFocus("fridgeInput");
  }

  if (id === "allergyInput") {
    state.allergyInput = value;

    // 한글 조합 중에는 render()를 실행하지 않음
    if (state.isComposingAllergy || event.isComposing) {
      return;
    }

    renderWithFocus("allergyInput");
  }
});

app.addEventListener("click", (event) => {
  const target = event.target;

  const navPage = target.dataset.nav;
  if (navPage) {
    state.page = navPage;
    render();
    return;
  }

  const action = target.dataset.action;

  if (action === "goSignup") {
    state.signupNotice = "회원가입을 먼저 진행해주세요.";
    state.highlightSignup = false;
    state.page = "signup";
    render();
    return;
  }

  if (action === "goLogin") {
    state.loginNotice = "로그인해주세요.";
    state.loginNoticeType = "info";
    state.highlightSignup = false;

    // 회원가입 화면에서 로그인 화면으로 돌아갈 때 입력칸 비우기
    state.loginId = "";
    state.loginPassword = "";

    state.page = "login";
    render();
    return;
  }

  if (action === "logout") {
    state.userId = "";
    state.loginNotice = "로그아웃되었습니다. 다시 로그인해주세요.";
    state.loginNoticeType = "info";
    state.highlightSignup = false;
    state.page = "login";
    render();
    return;
  }

  if (action === "recommend") {
    state.recommendedRecipes = calculateRecommendedRecipes();
    state.page = "recipes";
    render();
    return;
  }

  const selectedIngredient = target.dataset.selectedIngredient;
  if (selectedIngredient) {
    state.selectedIngredient = selectedIngredient;
    render();
    return;
  }

  const removeFridgeId = target.dataset.removeFridge;
  if (removeFridgeId) {
    state.fridgeItems = state.fridgeItems.filter(
      (item) => item.id !== removeFridgeId
    );

    if (
      state.selectedIngredient !== NO_REQUIRED_INGREDIENT &&
      !state.fridgeItems.some((item) => item.name === state.selectedIngredient)
    ) {
      state.selectedIngredient = NO_REQUIRED_INGREDIENT;
    }

    saveToStorage(STORAGE_KEYS.fridge, state.fridgeItems);
    render();
    return;
  }

  const removeAllergyId = target.dataset.removeAllergy;
  if (removeAllergyId) {
    state.allergies = state.allergies.filter(
      (item) => item.id !== removeAllergyId
    );

    saveToStorage(STORAGE_KEYS.allergies, state.allergies);
    render();
    return;
  }

  const suggestionType = target.dataset.suggestionType;
  const suggestionName = target.dataset.suggestionName;

  if (suggestionType === "fridge") {
    addFridgeIngredient(suggestionName);
    return;
  }

  if (suggestionType === "allergy") {
    addAllergyIngredient(suggestionName);
    return;
  }

  const recipeId = target.dataset.recipeId;
  if (recipeId) {
    state.selectedRecipe = state.recommendedRecipes.find(
      (recipe) => String(recipe.recipeId) === String(recipeId)
    );

    state.page = "detail";
    render();
  }
});

render();
fetchRecipeCsv();