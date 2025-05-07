import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Placeholder, LayoutServiceData, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import useEngage from 'lib/personalize/engage';

interface DefaultLayoutProps {
  layoutData: LayoutServiceData;
}

const DefaultLayout = ({ layoutData }: DefaultLayoutProps): JSX.Element => {

  useEngage();
  

  return (
    <>
      <Head>
        <title>Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>
      <body>
        <div className="container mx-auto px-4 py-8">
          <Placeholder name="jss-main" rendering={layoutData} />
        </div>
      </body>
    </>
  );
};

export default DefaultLayout;
