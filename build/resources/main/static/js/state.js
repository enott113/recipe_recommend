const app = document.getElementById("app");

const state = {
  page: "login",

  loginId: "",
  loginPassword: "",
  loginNotice: "",
  loginNoticeType: "info",
  highlightSignup: false,

  signupId: "",
  signupPassword: "",
  passwordConfirm: "",
  signupNotice: "",

  userId: "",

  registeredUsers: normalizeUsers(loadFromStorage(STORAGE_KEYS.users, [])),

  fridgeItems: loadFromStorage(STORAGE_KEYS.fridge, [
    { id: "sample-1", name: "김치" },
    { id: "sample-2", name: "밥" },
    { id: "sample-3", name: "계란" },
    { id: "sample-4", name: "간장" },
    { id: "sample-5", name: "참기름" },
  ]),

  allergies: loadFromStorage(STORAGE_KEYS.allergies, []),

  selectedIngredient: NO_REQUIRED_INGREDIENT,

  recipeData: [],
  csvMessage: "",
  isFallback: false,

  recommendedRecipes: [],
  selectedRecipe: null,

  fridgeInput: "",
  allergyInput: "",

  isComposingFridge: false,
  isComposingAllergy: false,
};

saveToStorage(STORAGE_KEYS.users, state.registeredUsers);