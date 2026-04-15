import {
  buildCriterionExpression,
  Sort as HeadlessSort,
  SortCriterion,
} from "@coveo/headless";
import React from "react";
import { useEffect, useState } from "react";

interface SortProps {
  controller: HeadlessSort;
  criteria: [string, SortCriterion][];
}

const Sort: React.FC<SortProps> = (props) => {
  const { controller, criteria } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  const getCriterionFromName = (name: string) =>
    criteria.find(([criterionName]) => criterionName === name)!;

  const getCurrentCriterion = () =>
    criteria.find(
      ([, criterion]) =>
        state.sortCriteria === buildCriterionExpression(criterion)
    )!;

  return (
    <div className="sort">
      <p>Sort by:&nbsp;</p>
      <select
        className="sort-select"
        value={getCurrentCriterion()[0]}
        onChange={(e) =>
          controller.sortBy(getCriterionFromName(e.target.value)[1])
        }
      >
        {props.criteria.map(([criterionName]) => (
          <option key={criterionName} value={criterionName}>
            {criterionName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sort;
