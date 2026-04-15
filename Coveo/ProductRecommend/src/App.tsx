import { Routes, Route, Link } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import SearchBox from "./components/SearchBox";
import ProductDetailPage from "./components/ProductDetailPage";
import {
  searchBox as SearchBoxController,
  instantResults as InstantResultsController,
} from "./controllers/controllers";
declare global {
  function coveoua(action?: string, fieldName?: any, fieldValue?: any): any;
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/">
          <img src={require("./assets/barca.svg").default} alt="barcaLogo" />
        </Link>
        <div className="search-section">
          <SearchBox
            controllerSearchbox={SearchBoxController}
            controllerInstantResults={InstantResultsController}
          />
        </div>
      </header>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
