# Coveo Headless Commerce Starter Project - Coveo Product Recommendations

This is a clone/sub-set of the Coveo project at (https://levelup.coveo.com/learn/courses/headless-tutorial).

## Overview

Compared with the original Headless tutorial, this project focuses specifically on commerce/product use cases and:

- Adds working Product Recommendation setups using `@coveo/headless/product-recommendation`.
- Wires multiple recommendation lists (cart, frequently bought/viewed together, popular, user interests).
- Retrieves additional custom commerce fields (images, prices, PDP links, etc.) as part of the recommendation results.
- Provides a minimal product search and product detail experience you can adapt to your own index.

This repository is meant as a practical, end‑to‑end example when the base tutorial is not enough to get Product Recommendations running with real fields.

## Setup

Clone or download the project and run `npm install` in the project directory.


## Configuring Engine.ts

To point the app to your own Coveo organization and pipeline, update the configuration values in `src/Engine.ts`:

1. Open `src/Engine.ts`.
2. Locate the `createSearchEngine` configuration block:
	- Change `organizationId` from `"demoTechnonprod"` to your Coveo organization ID.
	- Replace the `accessToken` value with a valid API key that has the required permissions.
	- (Optional) Update `search.pipeline` and `search.searchHub` to match your pipeline and search hub names.
3. Locate the `createPREngine` configuration block and update:
	- `organizationId` to the same organization ID you used above.
	- `accessToken` to the same (or another appropriate) API key.
	- `searchHub` to the search hub you want to use for recommendations.
4. (Optional) Review the `FIELDS` array at the top of `src/Engine.ts` and add or remove field names to match the fields configured in your Coveo index.


## `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\