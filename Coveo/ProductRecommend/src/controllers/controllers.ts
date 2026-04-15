import {
  SearchBox,
  buildSearchBox,
  buildResultList,
  buildFacet,
  buildPager,
  buildInstantResults,
  SortCriterion,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  buildFieldSortCriterion,
  SortOrder,
  buildSort,
} from "@coveo/headless";
import {
  buildFrequentlyViewedTogetherList,
  buildCartRecommendationsList,
  buildFrequentlyBoughtTogetherList,
  buildPopularBoughtRecommendationsList,
  buildPopularViewedRecommendationsList,
  buildUserInterestRecommendationsList
} from "@coveo/headless/product-recommendation";
import { FIELDS, headlessEngine, popularBoughtRecommendationsListPREngine, popularViewedRecommendationsListPREngine, userInterestRecommendationsListPREngine } from "../Engine";
import {
  frequentlyViewedTogetherListPREngine,
  cartRecommendationsListPREngine,
  frequentlyBoughtTogetherListPREngine
} from "../Engine";

export const searchBox: SearchBox = buildSearchBox(headlessEngine);

export const resultList = buildResultList(headlessEngine);
export const instantResults = buildInstantResults(headlessEngine, {
  options: { maxResultsPerQuery: 1 },
});

export const categoryFacet = buildFacet(headlessEngine, {
  options: { field: "ec_category" },
});
export const colorFacet = buildFacet(headlessEngine, {
  options: { field: "cat_color" },
});
export const levelFacet = buildFacet(headlessEngine, {
  options: { field: "cat_level" },
});

export const pager = buildPager(headlessEngine);

export const criteria: [string, SortCriterion][] = [
  ["Relevance", buildRelevanceSortCriterion()],
  ["Date (Ascending)", buildDateSortCriterion(SortOrder.Ascending)],
  ["Size (Ascending)", buildFieldSortCriterion("size", SortOrder.Ascending)],
];
const initialCriterion = criteria[0][1];
export const sort = buildSort(headlessEngine, {
  initialState: { criterion: initialCriterion },
});

export const cartRecommendationsListController = buildCartRecommendationsList(
  cartRecommendationsListPREngine,
  {
    options: {
      maxNumberOfRecommendations: 6,
      additionalFields: FIELDS,
    },
  }
);

export const frequentlyBoughtTogetherListController = (sku: any) =>
  buildFrequentlyBoughtTogetherList(
    frequentlyBoughtTogetherListPREngine,
    {
      options: {
        sku: sku, // Set SKU dynamically
        maxNumberOfRecommendations: 6,
        additionalFields: FIELDS,
      },
    }
  );

export const frequentlyViewedTogetherListController = buildFrequentlyViewedTogetherList(
  frequentlyViewedTogetherListPREngine,
  {
    options: {
      maxNumberOfRecommendations: 6,
      additionalFields: FIELDS,
    },
  }
);

export const popularBoughtRecommendationsList= buildPopularBoughtRecommendationsList(
  popularBoughtRecommendationsListPREngine,
  {
    options: {
      maxNumberOfRecommendations: 6,
      additionalFields: FIELDS,
    },
  }
);

export const popularViewedRecommendationsList= buildPopularViewedRecommendationsList(
  popularViewedRecommendationsListPREngine,
  {
    options: {
      maxNumberOfRecommendations: 6,
      additionalFields: FIELDS,
    },
  }
);

export const userInterestRecommendationsList= buildUserInterestRecommendationsList (
  userInterestRecommendationsListPREngine,
  {
    options: {
      maxNumberOfRecommendations: 6,
      additionalFields: FIELDS,
    },
  }
);

