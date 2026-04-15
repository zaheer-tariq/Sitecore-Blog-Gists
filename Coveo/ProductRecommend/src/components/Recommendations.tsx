import {
  FrequentlyViewedTogetherList,
  CartRecommendationsList,
  ProductRecommendationEngine,
} from "@coveo/headless/product-recommendation";
import { useEffect, useState } from "react";
import { logRecsClick } from "../Engine";
import { Link } from "react-router-dom";

interface RecommendationsProps {
  label: string;
  engine: ProductRecommendationEngine;
  controller: FrequentlyViewedTogetherList | CartRecommendationsList;
  productID: string;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  label,
  engine,
  controller,
  productID,
}) => {
  const [state, setState] = useState(controller.state);

  useEffect(() => {
    controller.subscribe(() => setState(controller.state));
    controller.refresh();
  }, [controller]);

  if (state.error) {
    return null;
  }

  controller.setSkus([productID]);

  console.log("state.recommendations", state.recommendations)

  return (
    <div className="recs-list">
      <h2>{label}</h2>
      <ul>
        {state.recommendations.map((recommendation) => {
          return (
            <li key={recommendation.permanentid}>
              <h2>
                <Link
                  to={`/products/${recommendation.permanentid as string}`}
                  state={{ result: recommendation }}
                  onClick={() => logRecsClick(recommendation, engine)}
                >
                  {recommendation.additionalFields.title as string} <br />
                  {recommendation.additionalFields.demo_productid as string} <br />
                </Link>
              </h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Recommendations;
