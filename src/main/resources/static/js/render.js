function renderHeader() {
  if (state.page === "login" || state.page === "signup") {
    return "";
  }

  return `
    <header class="header">
      <div>
        <h1>남김없이</h1>
        <p>냉장고 속 남은 재료로 만들 수 있는 요리를 추천해드려요.</p>
      </div>
      <nav>
        <button data-nav="home">홈</button>
        <button data-nav="fridge">나의 냉장고</button>
        <button data-action="logout">로그아웃</button>
      </nav>
    </header>
  `;
}

function renderMatchRateBar(value) {
  return `
    <div class="matchBlock">
      <div class="matchLabel">
        <span>매칭률</span>
        <strong>${value}%</strong>
      </div>
      <div class="barTrack">
        <div class="barFill" style="width: ${value}%"></div>
      </div>
    </div>
  `;
}

function renderIngredientSummary(label, items, type, emptyText = "없음") {
  return `
    <div class="summaryBlock">
      <strong>${escapeHtml(label)}</strong>
      <div class="miniChipRow">
        ${
          items.length === 0
            ? `<span class="miniChip muted">${escapeHtml(emptyText)}</span>`
            : items
                .map(
                  (item) =>
                    `<span class="miniChip ${type}">${escapeHtml(item)}</span>`
                )
                .join("")
        }
      </div>
    </div>
  `;
}

function renderLoginPage() {
  return `
    <main class="centerPage">
      <section class="loginCard ${state.highlightSignup ? "signupFocusCard" : ""}">
        <span class="badge">1인 가구 식재료 활용 서비스</span>
        <h2>로그인</h2>
        <p>남은 식재료를 등록하고, 매칭률이 높은 레시피를 추천받아보세요.</p>

        ${
          state.loginNotice
            ? `<div class="noticeBox ${
                state.loginNoticeType === "warning" ? "warning" : ""
              }">${escapeHtml(state.loginNotice)}</div>`
            : ""
        }

        <form id="loginForm" class="loginForm">
          <label>
            아이디
            <input
              id="loginId"
              value="${escapeHtml(state.loginId)}"
              placeholder="가입한 아이디를 입력하세요"
            />
          </label>

          <label>
            비밀번호
            <input
              id="loginPassword"
              type="password"
              value="${escapeHtml(state.loginPassword)}"
              placeholder="비밀번호를 입력하세요"
            />
          </label>

          <button class="primaryButton" type="submit">로그인하기</button>
        </form>

        <button
          class="textButton ${state.highlightSignup ? "highlightSignupButton" : ""}"
          data-action="goSignup"
        >
          회원가입하기
        </button>
      </section>
    </main>
  `;
}

function renderSignupPage() {
  return `
    <main class="centerPage signupBackground">
      <section class="loginCard signupCard">
        <span class="badge warningBadge">회원가입 필요</span>
        <h2>회원가입</h2>
        <p>회원가입이 되어 있지 않은 사용자입니다. 회원가입을 먼저 진행해주세요.</p>

        ${
          state.signupNotice
            ? `<div class="noticeBox warning">${escapeHtml(
                state.signupNotice
              )}</div>`
            : ""
        }

        <form id="signupForm" class="loginForm">
          <label>
            사용할 아이디
            <input
              id="signupId"
              value="${escapeHtml(state.signupId)}"
              placeholder="예: somin01"
            />
          </label>

          <label>
            비밀번호
            <input
              id="signupPassword"
              type="password"
              value="${escapeHtml(state.signupPassword)}"
              placeholder="비밀번호를 입력하세요"
            />
          </label>

          <label>
            비밀번호 확인
            <input
              id="passwordConfirm"
              type="password"
              value="${escapeHtml(state.passwordConfirm)}"
              placeholder="비밀번호를 한 번 더 입력하세요"
            />
          </label>

          <button class="primaryButton signupPrimaryButton" type="submit">
            회원가입 완료
          </button>
        </form>

        <button class="textButton" data-action="goLogin">
          이미 가입했다면 로그인하기
        </button>
      </section>
    </main>
  `;
}

function renderHomePage() {
  const candidateIngredients = [
    NO_REQUIRED_INGREDIENT,
    ...state.fridgeItems.map((item) => item.name),
  ];

  return `
    <main class="page">
      <section class="hero">
        <div>
          <span class="badge">오늘의 냉장고 추천</span>
          <h2>${escapeHtml(state.userId)}님, 어떤 재료를 먼저 사용하고 싶나요?</h2>
          <p>
            현재 냉장고에 등록한 재료 중 필수로 넣고 싶은 재료를 선택하면,
            백엔드에서 제공한 CSV 레시피 데이터와 비교해 매칭률이 높은 레시피를 추천합니다.
          </p>
        </div>
        <button class="secondaryButton" data-nav="fridge">
          냉장고 / 알러지 관리
        </button>
      </section>

      ${
        state.csvMessage
          ? `<div class="noticeBox ${
              state.isFallback ? "warning" : ""
            }">${escapeHtml(state.csvMessage)}</div>`
          : ""
      }

      <section class="panel">
        <h3>필수 재료 선택</h3>
        <p class="subText">
          반드시 사용하고 싶은 재료를 선택하세요. 필수 재료가 없다면 없음으로 선택하면 됩니다.
        </p>

        ${
          state.fridgeItems.length === 0
            ? `<p class="emptyText">현재 등록된 냉장고 재료가 없습니다.</p>`
            : `
              <div class="chipGrid">
                ${candidateIngredients
                  .map(
                    (ingredient) => `
                    <button
                      class="chip ${
                        state.selectedIngredient === ingredient ? "active" : ""
                      }"
                      data-selected-ingredient="${escapeHtml(ingredient)}"
                    >
                      ${escapeHtml(ingredient)}
                    </button>
                  `
                  )
                  .join("")}
              </div>
            `
        }

        <div class="actionRow">
          <button
            class="primaryButton"
            data-action="recommend"
            ${state.fridgeItems.length === 0 ? "disabled" : ""}
          >
            레시피 추천받기
          </button>
          ${
            state.fridgeItems.length === 0
              ? `<span class="hint">먼저 나의 냉장고에 재료를 등록해주세요.</span>`
              : ""
          }
        </div>
      </section>

      <section class="panel">
        <h3>현재 나의 냉장고</h3>
        ${
          state.fridgeItems.length === 0
            ? `<p class="emptyText">등록된 재료가 없습니다.</p>`
            : `
              <div class="chipGrid">
                ${state.fridgeItems
                  .map(
                    (item) =>
                      `<span class="chip staticChip">${escapeHtml(item.name)}</span>`
                  )
                  .join("")}
              </div>
            `
        }
      </section>

      <section class="panel allergySummaryPanel">
        <h3>등록된 알러지</h3>
        <p class="subText">
          알러지에 등록된 재료가 들어간 레시피는 추천 결과에서 제외됩니다.
        </p>
        ${
          state.allergies.length === 0
            ? `<p class="emptyText">등록된 알러지가 없습니다.</p>`
            : `
              <div class="chipGrid">
                ${state.allergies
                  .map(
                    (item) =>
                      `<span class="chip allergyChip">${escapeHtml(item.name)}</span>`
                  )
                  .join("")}
              </div>
            `
        }
      </section>
    </main>
  `;
}

function renderSuggestionBox(keyword, suggestions, type) {
  if (!keyword.trim()) return "";

  return `
    <div class="suggestionBox">
      <strong>데이터셋 유사 검색어</strong>
      ${
        suggestions.length === 0
          ? `<p class="emptyText">데이터셋에서 유사한 재료를 찾지 못했습니다.</p>`
          : `
            <div class="suggestionChipRow">
              ${suggestions
                .map(
                  (ingredient) => `
                  <button
                    type="button"
                    class="suggestionChip"
                    data-suggestion-type="${type}"
                    data-suggestion-name="${escapeHtml(ingredient)}"
                  >
                    ${escapeHtml(ingredient)}
                  </button>
                `
                )
                .join("")}
            </div>
          `
      }
    </div>
  `;
}

function renderFridgePage() {
  const datasetIngredients = getDatasetIngredients(state.recipeData);

  const ingredientSuggestions = getSimilarIngredients(
    state.fridgeInput,
    datasetIngredients
  );

  const allergySuggestions = getSimilarIngredients(
    state.allergyInput,
    datasetIngredients
  );

  return `
    <main class="page">
      <section class="panel fridgePanel">
        <div>
          <h2>나의 냉장고</h2>
          <p class="subText">현재 가지고 있는 재료와 알러지 재료를 관리하세요.</p>
        </div>
        <button class="secondaryButton" data-nav="home">홈으로 돌아가기</button>
      </section>

      <section class="fridgeManageGrid">
        <section class="panel">
          <h3>냉장고 재료 등록</h3>
          <form id="fridgeForm" class="fridgeForm">
            <label>
              재료명
              <input
                id="fridgeInput"
                value="${escapeHtml(state.fridgeInput)}"
                placeholder="예: 고기, 김치, 계란"
              />
            </label>
            <button class="primaryButton" type="submit">재료 추가</button>
          </form>

          ${renderSuggestionBox(
            state.fridgeInput,
            ingredientSuggestions,
            "fridge"
          )}
        </section>

        <section class="panel allergyPanel">
          <h3>알러지 등록</h3>
          <p class="subText">등록한 알러지 재료가 포함된 레시피는 추천하지 않습니다.</p>
          <form id="allergyForm" class="fridgeForm">
            <label>
              알러지 재료명
              <input
                id="allergyInput"
                value="${escapeHtml(state.allergyInput)}"
                placeholder="예: 고기, 계란, 돼지고기"
              />
            </label>
            <button class="allergyButton" type="submit">알러지 추가</button>
          </form>

          ${renderSuggestionBox(
            state.allergyInput,
            allergySuggestions,
            "allergy"
          )}
        </section>
      </section>

      <section class="fridgeManageGrid">
        <section class="panel">
          <h3>등록된 재료</h3>
          ${
            state.fridgeItems.length === 0
              ? `<p class="emptyText">아직 등록된 재료가 없습니다.</p>`
              : `
                <div class="ingredientList">
                  ${state.fridgeItems
                    .map(
                      (item) => `
                      <div class="ingredientItem">
                        <div>
                          <strong>${escapeHtml(item.name)}</strong>
                          <span>냉장고 보유 재료</span>
                        </div>
                        <button data-remove-fridge="${escapeHtml(
                          item.id
                        )}">삭제</button>
                      </div>
                    `
                    )
                    .join("")}
                </div>
              `
          }
        </section>

        <section class="panel allergyPanel">
          <h3>등록된 알러지</h3>
          ${
            state.allergies.length === 0
              ? `<p class="emptyText">등록된 알러지가 없습니다.</p>`
              : `
                <div class="ingredientList">
                  ${state.allergies
                    .map(
                      (item) => `
                      <div class="ingredientItem allergyItem">
                        <div>
                          <strong>${escapeHtml(item.name)}</strong>
                          <span>추천 제외 재료</span>
                        </div>
                        <button data-remove-allergy="${escapeHtml(
                          item.id
                        )}">삭제</button>
                      </div>
                    `
                    )
                    .join("")}
                </div>
              `
          }
        </section>
      </section>
    </main>
  `;
}

function renderRecipeListPage() {
  const readyRecipes = state.recommendedRecipes.filter(
    (recipe) => recipe.missingIngredients.length === 0
  );

  const needMoreRecipes = state.recommendedRecipes.filter(
    (recipe) => recipe.missingIngredients.length > 0
  );

  return `
    <main class="page">
      <section class="panel fridgePanel">
        <div>
          <h2>추천 레시피</h2>
          <p class="subText">매칭률이 높은 순서로 정렬했습니다.</p>
          ${
            state.allergies.length > 0
              ? `<p class="allergyNoticeText">
                  알러지 재료 ${state.allergies
                    .map((item) => escapeHtml(item.name))
                    .join(", ")}가 포함된 레시피는 제외했습니다.
                </p>`
              : ""
          }
        </div>
        <button class="secondaryButton" data-nav="home">다시 선택하기</button>
      </section>

      ${renderRecipeSection("바로 만들 수 있는 레시피", readyRecipes)}
      ${renderRecipeSection("추가 재료가 더 필요한 레시피", needMoreRecipes)}
    </main>
  `;
}

function renderRecipeSection(title, recipes) {
  return `
    <section class="panel">
      <h3>${escapeHtml(title)}</h3>
      ${
        recipes.length === 0
          ? `<p class="emptyText">해당되는 레시피가 없습니다.</p>`
          : `<div class="recipeGrid">${recipes.map(renderRecipeCard).join("")}</div>`
      }
    </section>
  `;
}

function renderRecipeCard(recipe) {
  return `
    <article class="recipeCard">
      <div class="cardTop">
        <span class="statusBadge">${escapeHtml(recipe.availableType)}</span>
        <span class="score">${recipe.matchRate}%</span>
      </div>

      <h4>${escapeHtml(recipe.recipeName)}</h4>

      ${renderMatchRateBar(recipe.matchRate)}

      ${renderIngredientSummary("보유 재료", recipe.ownedIngredients, "owned")}

      ${renderIngredientSummary(
        "부족한 재료",
        recipe.missingIngredients,
        "missing",
        "부족한 재료 없음"
      )}

      <button class="primaryButton fullWidth" data-recipe-id="${recipe.recipeId}">
        레시피 보기
      </button>
    </article>
  `;
}

function renderRecipeDetailPage() {
  const recipe = state.selectedRecipe;

  if (!recipe) {
    return `
      <main class="page">
        <section class="panel">
          <p>선택된 레시피가 없습니다.</p>
          <button class="primaryButton" data-nav="recipes">
            목록으로 돌아가기
          </button>
        </section>
      </main>
    `;
  }

  return `
    <main class="page">
      <section class="detailHero">
        <button class="secondaryButton" data-nav="recipes">
          목록으로 돌아가기
        </button>
        <span class="badge">추천 레시피</span>
        <h2>${escapeHtml(recipe.recipeName)}</h2>
        <p>${escapeHtml(recipe.availableType)}</p>
        ${renderMatchRateBar(recipe.matchRate)}
      </section>

      <section class="detailGrid">
        <div class="panel">
          <h3>필요 재료 전체</h3>
          <div class="chipGrid">
            ${recipe.requiredIngredients
              .map(
                (item) =>
                  `<span class="chip staticChip">${escapeHtml(item)}</span>`
              )
              .join("")}
          </div>
        </div>

        <div class="panel">
          <h3>내가 가진 재료</h3>
          <div class="chipGrid">
            ${recipe.ownedIngredients
              .map(
                (item) =>
                  `<span class="chip ownedChip">${escapeHtml(item)}</span>`
              )
              .join("")}
          </div>
        </div>

        <div class="panel">
          <h3>부족한 재료</h3>
          <div class="chipGrid">
            ${
              recipe.missingIngredients.length === 0
                ? `<span class="chip successChip">부족한 재료 없음</span>`
                : recipe.missingIngredients
                    .map(
                      (item) =>
                        `<span class="chip missingChip">${escapeHtml(item)}</span>`
                    )
                    .join("")
            }
          </div>
        </div>
      </section>

      <section class="panel">
        <h3>조리 방법</h3>
        <ol class="stepList">
          ${recipe.steps
            .map(
              (step, index) => `
              <li>
                <span>${index + 1}</span>
                <p>${escapeHtml(step)}</p>
              </li>
            `
            )
            .join("")}
        </ol>
      </section>
    </main>
  `;
}

function render() {
  let pageHtml = "";

  if (state.page === "login") pageHtml = renderLoginPage();
  if (state.page === "signup") pageHtml = renderSignupPage();
  if (state.page === "home") pageHtml = renderHomePage();
  if (state.page === "fridge") pageHtml = renderFridgePage();
  if (state.page === "recipes") pageHtml = renderRecipeListPage();
  if (state.page === "detail") pageHtml = renderRecipeDetailPage();

  app.innerHTML = `
    <div class="app">
      ${renderHeader()}
      ${pageHtml}
    </div>
  `;
}