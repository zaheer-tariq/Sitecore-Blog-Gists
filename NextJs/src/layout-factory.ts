import { RouteData } from '@sitecore-jss/sitecore-jss-nextjs';
import Layout from 'src/layouts/Layout';
import SecondLayout from 'src/layouts/SecondLayout';

const layoutMap = new Map();
layoutMap.set('{F7D5F0B5-CAB0-417D-AA18-E2A4E2BFF4BF}', SecondLayout);
layoutMap.set('default', Layout);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function resolveLayout(routeData: RouteData) {
  const layoutId = `{${routeData?.layoutId?.toUpperCase()}}`;
  const layout = layoutMap.get(layoutId);
  return layout || layoutMap.get('default');
}
