import { Engage, init } from '@sitecore/engage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let engage: Engage | null = null;

export const loadEngage = async (): Promise<void> => {
  engage = await init({
    clientKey: process.env.NEXT_PUBLIC_SITECORE_PERSONALIZE_CLIENT_KEY || '',
    targetURL: 'https://api-engage-us.sitecorecloud.io',
    pointOfSale: process.env.NEXT_PUBLIC_SITECORE_PERSONALIZE_POS || '',
    cookieDomain: process.env.NEXT_PUBLIC_SITECORE_PERSONALIZE_COOKIE_DOMAIN || '',
    cookieExpiryDays: 365,
    forceServerCookieMode: false,
    includeUTMParameters: true,
    webPersonalization: true,
  });
};

export { engage };