package com.example.recipe_recommend.service;

import com.example.recipe_recommend.dto.CrawledIngredientDto;
import com.example.recipe_recommend.dto.CrawledRecipeDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeCrawlerService {

  private static final String BASE_URL = "https://www.10000recipe.com";

  public CrawledRecipeDto crawlRecipe(String keyword) {
    try {
      String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);

      String searchUrl = BASE_URL + "/recipe/list.html?q=" + encodedKeyword + "&order=reco&page=1";

      Document searchDoc = Jsoup.connect(searchUrl)
          .userAgent("Mozilla/5.0")
          .timeout(10000)
          .get();

      Element firstRecipe = searchDoc.selectFirst("a.common_sp_link");

      if (firstRecipe == null) {
        throw new RuntimeException("검색 결과가 없습니다.");
      }

      String detailPath = firstRecipe.attr("href");
      String detailUrl = BASE_URL + detailPath;

      Element img = firstRecipe.selectFirst("img");
      String thumbnailUrl = img != null ? img.attr("src") : null;

      return crawlDetail(detailUrl, thumbnailUrl);

    } catch (Exception e) {
      throw new RuntimeException("레시피 크롤링 실패: " + e.getMessage(), e);
    }
  }

  private CrawledRecipeDto crawlDetail(String detailUrl, String thumbnailUrl) {
    try {
      Document doc = Jsoup.connect(detailUrl)
          .userAgent("Mozilla/5.0")
          .timeout(10000)
          .get();

      String title = parseTitle(doc);

      List<CrawledIngredientDto> ingredients = parseIngredients(doc);

      String recipeText = parseSteps(doc);

      return new CrawledRecipeDto(
          title,
          detailUrl,
          thumbnailUrl,
          recipeText,
          ingredients
      );

    } catch (Exception e) {
      throw new RuntimeException("레시피 상세 파싱 실패: " + e.getMessage(), e);
    }
  }

  private String parseTitle(Document doc) {
    Element titleElement = doc.selectFirst(".view2_summary h3");

    if (titleElement == null) {
      titleElement = doc.selectFirst("h3");
    }

    if (titleElement == null) {
      return "제목 없음";
    }

    return cleanText(titleElement.text());
  }

  private List<CrawledIngredientDto> parseIngredients(Document doc) {
    List<CrawledIngredientDto> result = new ArrayList<>();

    Elements ingredientElements = doc.select(".ready_ingre3 ul li");

    for (Element element : ingredientElements) {
      String name = cleanText(element.ownText());

      Element amountElement = element.selectFirst("span");
      String amount = amountElement != null ? cleanText(amountElement.text()) : "";

      if (!name.isBlank()) {
        result.add(new CrawledIngredientDto(name, amount));
      }
    }

    return result;
  }

  private String parseSteps(Document doc) {
    StringBuilder sb = new StringBuilder();

    Elements steps = doc.select(".view_step_cont");

    int stepNo = 1;

    for (Element step : steps) {
      String text = cleanText(step.text());

      if (!text.isBlank()) {
        sb.append(stepNo)
            .append(". ")
            .append(text)
            .append("\n");

        stepNo++;
      }
    }

    if (sb.isEmpty()) {
      return "조리법 정보 없음";
    }

    return sb.toString();
  }

  private String cleanText(String text) {
    if (text == null) {
      return "";
    }

    return text
        .replace("\n", " ")
        .replace("\t", " ")
        .replace("\r", " ")
        .replaceAll("\\s+", " ")
        .trim();
  }
}