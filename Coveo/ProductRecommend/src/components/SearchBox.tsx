import {
  SearchBox as SearchBoxController,
  InstantResults as InstantResultsController,
} from "@coveo/headless";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBoxProps {
  controllerSearchbox: SearchBoxController;
  controllerInstantResults: InstantResultsController;
}

export const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { controllerSearchbox, controllerInstantResults } = props;
  const [searchboxState, setStateSearchbox] = useState(
    controllerSearchbox.state
  );
  const [instantResultsState, setStateInstantResults] = useState(
    controllerInstantResults.state
  );

  useEffect(
    () =>
      controllerSearchbox.subscribe(() =>
        setStateSearchbox(controllerSearchbox.state)
      ),
    [controllerSearchbox]
  );
  useEffect(
    () =>
      controllerInstantResults.subscribe(() =>
        setStateInstantResults(controllerInstantResults.state)
      ),
    [controllerInstantResults]
  );

  function ensureOnSearchPage() {
    const onSearchPage = location.pathname === "/";
    if (!onSearchPage) navigate("/");
  }

  return (
    <div className="search-box">
      <input
        value={searchboxState.value}
        onChange={(e) => controllerSearchbox.updateText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            controllerSearchbox.submit();
            ensureOnSearchPage();
          } else if (e.key === "Escape") {
            controllerSearchbox.clear();
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <div className="search-results">
        {searchboxState.suggestions.length > 0 && (
          <div className="search-queries">
            {searchboxState.suggestions.map((suggestion) => {
              return (
                <p
                  key={suggestion.rawValue}
                  onMouseEnter={() =>
                    controllerInstantResults.updateQuery(suggestion.rawValue)
                  }
                  onClick={() =>
                    controllerSearchbox.selectSuggestion(suggestion.rawValue)
                  }
                  dangerouslySetInnerHTML={{
                    __html: suggestion.highlightedValue,
                  }}
                ></p>
              );
            })}
          </div>
        )}
        {instantResultsState.results.length > 0 && (
          <div className="search-instant-results">
            {instantResultsState.results.map((result) => {
              return (
                <>
                  <h3>{result.title}</h3>
                  <p>{result.excerpt}</p>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
