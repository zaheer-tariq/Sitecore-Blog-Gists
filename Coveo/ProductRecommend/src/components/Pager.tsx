import { useEffect, useState } from "react";
import { Pager as PagerController } from "@coveo/headless";

interface PagerProps {
  controller: PagerController;
}

export const Pager: React.FC<PagerProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  return (
    <div className="pager">
      <nav>
        <button
          className="pager-arrow"
          disabled={!state.hasPreviousPage}
          onClick={() => controller.previousPage()}
        >
          {"<"}
        </button>
        {state.currentPages.map((page) => (
          <button
            className="pager-number"
            key={page}
            disabled={controller.isCurrentPage(page)}
            onClick={() => controller.selectPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pager-arrow"
          disabled={!state.hasNextPage}
          onClick={() => controller.nextPage()}
        >
          {">"}
        </button>
      </nav>
    </div>
  );
};

export default Pager;
