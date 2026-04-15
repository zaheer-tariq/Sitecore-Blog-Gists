import { useEffect } from "react";
import "../App.css";
import ResultList from "../components/ResultList";
import Facet from "../components/Facet";
import Pager from "../components/Pager";
import Sort from "../components/Sort";
import {
  resultList as ResultListController,
  categoryFacet as CategoryFacetController,
  colorFacet as ColorFacetController,
  levelFacet as LevelFacetController,
  pager as PagerController,
  sort as SortController,
  criteria as SortCriteria,
} from "../controllers/controllers";
import { headlessEngine } from "../Engine";

function SearchPage() {
  const logViewEvent = () => {
    coveoua("set", "page", window.location.pathname);
    coveoua("send", "pageview");
  };

  useEffect(() => {
    headlessEngine.executeFirstSearch();
    logViewEvent();
  }, []);
  return (
    <div className="app">
      <div className="app-body">
        <div className="main-section">
          <div className="facet-section column">
            <Facet controller={CategoryFacetController} title="Category" />
            <Facet controller={ColorFacetController} title="Color" />
            <Facet controller={LevelFacetController} title="Level" />
          </div>
          <div className="results-section column">
            <Sort controller={SortController} criteria={SortCriteria} />
            <ResultList controller={ResultListController} />
            <Pager controller={PagerController} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
