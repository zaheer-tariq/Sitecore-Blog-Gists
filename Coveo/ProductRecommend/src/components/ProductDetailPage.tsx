import {
  cartRecommendationsListController,
  frequentlyViewedTogetherListController,
  frequentlyBoughtTogetherListController,
  popularBoughtRecommendationsList,
  popularViewedRecommendationsList,
  userInterestRecommendationsList,
} from "../controllers/controllers";
import { cartRecommendationsListPREngine } from "../Engine";
import { useEffect, useRef, useState } from "react";
import { logRecsClick } from "../Engine";
import { Link } from "react-router-dom";

interface RenderRecommendationsProps {
  title: string;
  recommendations: any[];
  engine: any;
}

function RenderRecommendations({ title, recommendations, engine }: RenderRecommendationsProps) {
  return (
    <div className="recs-list">
      <h2>{title}</h2>
      <ol>
        {recommendations.map((recommendation) => (
          <li key={recommendation.permanentid}>
            <Link
              to={`/products/${recommendation.permanentid}`}
              state={{ result: recommendation }}
              onClick={() => logRecsClick(recommendation, engine)}
            >
              {recommendation.additionalFields.title} <br />
            </Link>
            <div>
              {recommendation.additionalFields.demo_productid} <br />
              {recommendation.additionalFields.ec_images} <br />
              {recommendation.additionalFields.ec_thumbnails} <br />
              {recommendation.additionalFields.demo_ext_product_image_url} <br />
              {recommendation.additionalFields.demo_ext_product_image_thumbnail_url} <br />
              {recommendation.additionalFields.demo_pdp_link} <br />
              {recommendation.additionalFields.ec_price} <br />
              {recommendation.additionalFields.demo_listprice} <br />
              {recommendation.additionalFields.demo_usd_price} <br />
              {recommendation.additionalFields.demo_eur_price} <br />
              {recommendation.additionalFields.demo_gbp_price} <br />
              {recommendation.additionalFields.demo_cad_price} <br />
              {recommendation.additionalFields.demo_jpy_price} <br />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProductDetailPage() {
  const engine = cartRecommendationsListPREngine;

  const cartRecommendations = cartRecommendationsListController;
  const frequentlyViewedTogether = frequentlyViewedTogetherListController;
  const frequentlyBoughtTogether = useRef(frequentlyBoughtTogetherListController('01tds00000giwqyya1')).current;
  const popularBoughtRecommendations = popularBoughtRecommendationsList;
  const popularViewedRecommendations = popularViewedRecommendationsList;
  const userInterestRecommendations = userInterestRecommendationsList;

  const [cartRecommendState, setCartRecommendState] = useState(cartRecommendations.state);
  const [frequentlyViewedState, setFrequentlyViewedState] = useState(frequentlyViewedTogether.state);
  const [frequentlyBoughtState, setFrequentlyBoughtState] = useState(frequentlyBoughtTogether.state);
  const [popularBoughtState, setPopularBoughtState] = useState(popularBoughtRecommendations.state);
  const [popularViewedState, setPopularViewedState] = useState(popularViewedRecommendations.state);
  const [userInterestState, setUserInterestState] = useState(userInterestRecommendations.state);
  
  const hasRefreshedFrequentlyBoughtTogether = useRef(false);

  useEffect(() => {
    cartRecommendations.subscribe(() => setCartRecommendState(cartRecommendations.state));
    frequentlyViewedTogether.subscribe(() => setFrequentlyViewedState(frequentlyViewedTogether.state));
    frequentlyBoughtTogether.subscribe(() => setFrequentlyBoughtState(frequentlyBoughtTogether.state));
    popularBoughtRecommendations.subscribe(() => setPopularBoughtState(popularBoughtRecommendations.state));
    popularViewedRecommendations.subscribe(() => setPopularViewedState(popularViewedRecommendations.state));
    userInterestRecommendations.subscribe(() => setUserInterestState(userInterestRecommendations.state));

    cartRecommendations.refresh();
    frequentlyViewedTogether.refresh();
    frequentlyBoughtTogether.refresh();
    popularBoughtRecommendations.refresh();
    popularViewedRecommendations.refresh();
    userInterestRecommendations.refresh();
  }, [
    cartRecommendations,
    frequentlyViewedTogether,
    frequentlyBoughtTogether,
    popularBoughtRecommendations,
    popularViewedRecommendations,
    userInterestRecommendations
  ]);

  // Effect for frequentlyBoughtTogether to prevent multiple refresh calls
  useEffect(() => {
    if (!hasRefreshedFrequentlyBoughtTogether.current) {
      frequentlyBoughtTogether.subscribe(() => setFrequentlyBoughtState(frequentlyBoughtTogether.state));
      frequentlyBoughtTogether.refresh();
      hasRefreshedFrequentlyBoughtTogether.current = true; // Ensure refresh happens only once
    }
  }, [frequentlyBoughtTogether]); // Only runs once when the component mounts

  if (
    cartRecommendState.error ||
    frequentlyViewedState.error ||
    frequentlyBoughtState.error ||
    popularBoughtState.error ||
    popularViewedState.error ||
    userInterestState.error
  ) {
    return null;
  }

  const productID = '01tds00000giwqyya1' as string;
  cartRecommendations.setSkus([productID]);

  const productID2 = '01tDS00000GIwR5YAL' as string;
  frequentlyViewedTogether.setSkus([productID2]);

  // Set SKUs for other controllers if needed
  // frequentlyBoughtTogether.setSkus([productID2]);
  // popularBoughtRecommendations.setSkus([productID]);
  // popularViewedRecommendations.setSkus([productID2]);
  // userInterestRecommendations.setSkus([productID]);

  return (
    <div className="pdp-section">      
      <div className="recs-section">
        <RenderRecommendations
          title="Popular Bought Recommendations"
          recommendations={popularBoughtState.recommendations}
          engine={engine}
        />
        <RenderRecommendations
          title="Popular Viewed Recommendations"
          recommendations={popularViewedState.recommendations}
          engine={engine}
        />
        <RenderRecommendations
          title="User Interest Recommendations"
          recommendations={userInterestState.recommendations}
          engine={engine}
        />
      </div>
      <div className="recs-section">
        <RenderRecommendations
          title="Cart Recommendations"
          recommendations={cartRecommendState.recommendations}
          engine={engine}
        />
        <RenderRecommendations
          title="Frequently Viewed Together Recommendations"
          recommendations={frequentlyViewedState.recommendations}
          engine={engine}
        />
        <RenderRecommendations
          title="Frequently Bought Together"
          recommendations={frequentlyBoughtState.recommendations}
          engine={engine}
        />
      </div>
    </div>
  );
}

export default ProductDetailPage;
