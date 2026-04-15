import { Facet as FacetController } from "@coveo/headless";
import { useEffect, useState } from "react";

interface FacetProps {
  controller: FacetController;
  title: string;
}

const Facet: React.FC<FacetProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  if (!state.values.length) {
    return null;
  }

  return (
    <div className="facet">
      <h3 className="facet-title">{props.title}</h3>
      <ul>
        {state.values.map((value) => (
          <li key={value.value}>
            <input
              type="checkbox"
              checked={controller.isValueSelected(value)}
              onChange={() => controller.toggleSelect(value)}
              disabled={state.isLoading}
            />
            {value.value} ({value.numberOfResults})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facet;
