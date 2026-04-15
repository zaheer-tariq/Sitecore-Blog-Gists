import { useState, useEffect } from "react";
import {
  ResultList as ResultListController,
  Result,
  buildInteractiveResult,
} from "@coveo/headless";
import { headlessEngine } from "../Engine";
import { Link } from "react-router-dom";

interface ResultListProps {
  controller: ResultListController;
}

const sendAddToCartEvent = (result: Result) => {
  const ec_category: String = (result.raw.ec_category as string[]).join("|");
  coveoua("ec:addProduct", {
    id: result.uniqueId,
    name: result.title,
    brand: result.raw.ec_brand,
    category: ec_category,
    price: result.raw.ec_price,
    variant: result.raw.ec_variant_sku,
    quantity: "1",
  });
  coveoua("ec:setAction", "add", {
    list: headlessEngine.state.search.response.searchUid,
  });
  coveoua("send", "event");
};

const sportsResultsTemplate = (result: Result) => {
  const interactiveResultController = buildInteractiveResult(headlessEngine, {
    options: { result: result },
  });

  return (
    <li key={result.uniqueId}>
      <div>
        <div className="result-item-header">
          <Link
            to={`/products/${result.raw.permanentid as string}`}
            onClick={() => interactiveResultController.select()}
            state={{ result: result }}
          >
            {result.title}
          </Link>

          <button
            className="result-button"
            onClick={() => sendAddToCartEvent(result)}
          >
            Add to cart
          </button>
        </div>
        <p>
          {result.excerpt} {result.raw.source}
        </p>
      </div>
    </li>
  );
};

const defaultResultsTemplate = (result: Result) => {
  return <p>{result.title}</p>;
};

const ResultList: React.FC<ResultListProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );
  if (!state.results.length) {
    return <div>No results</div>;
  }

  return (
    <div className="result-list">
      <ul>
        {state.results.map((result) => {
          if (result.raw.source === "Sports") {
            return sportsResultsTemplate(result);
          } else {
            return defaultResultsTemplate(result);
          }
        })}
      </ul>
    </div>
  );
};

export default ResultList;
