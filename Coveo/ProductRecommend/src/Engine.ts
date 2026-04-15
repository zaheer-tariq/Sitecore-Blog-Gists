import {
  buildSearchEngine,
  buildContext,
  loadFieldActions,
  SearchEngine,
} from "@coveo/headless";
import {
  buildProductRecommendationEngine,
  loadClickAnalyticsActions,
  ProductRecommendation,
  ProductRecommendationEngine,
} from "@coveo/headless/product-recommendation";

export const FIELDS = [  
  "permanentid",
  "ec_images",
	"ec_thumbnails",
	"demo_ext_product_image_thumbnail_url",
	"demo_ext_product_image_url",
  "demo_productid",
  "title",
  "demo_pdp_link",
  "demo_sku",

  "ec_price",
  "demo_listprice",

  "demo_usd_price",
  "demo_usd_listprice",
  "demo_eur_price",
  "demo_eur_listprice",
  "demo_gbp_price",
  "demo_gbp_listprice",
  "demo_cad_price",
  "demo_cad_listprice",
  "demo_jpy_price",
  "demo_jpy_listprice"
];

const registerAdditionalFields = (
  headlessEngine: SearchEngine | ProductRecommendationEngine
) => {
  const fieldActions = loadFieldActions(headlessEngine);
  headlessEngine.dispatch(fieldActions.registerFieldsToInclude(FIELDS));
  buildContext(headlessEngine as any);
  return headlessEngine;
};

const createSearchEngine = buildSearchEngine({
  configuration: {
    organizationId: "demoTechnonprod",
    accessToken: "xxxxx-xxxx-xxxx-xxx-xxxxxxxx",
    search: {
      pipeline: "Products rec",
      searchHub: "Products rec",
    },
  },
});
export const headlessEngine = registerAdditionalFields(
  createSearchEngine
) as SearchEngine;

const createPREngine = () =>
  buildProductRecommendationEngine({
    configuration: {
      organizationId: "demoTechnonprod",
      accessToken: "xxxxx-xxxx-xxxx-xxx-xxxxxxxx",
      searchHub: "Products rec",
    },
  });

  export const cartRecommendationsListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;

  export const frequentlyBoughtTogetherListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;
  
  export const frequentlyViewedTogetherListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;
  
  export const popularBoughtRecommendationsListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;
  
  export const popularViewedRecommendationsListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;
  
  export const userInterestRecommendationsListPREngine = registerAdditionalFields(
    createPREngine()
  ) as ProductRecommendationEngine;

export const logRecsClick = (
  recommendation: ProductRecommendation,
  engine: ProductRecommendationEngine
) => {
  const { logProductRecommendationOpen } = loadClickAnalyticsActions(engine);
  engine.dispatch(logProductRecommendationOpen(recommendation));
};
