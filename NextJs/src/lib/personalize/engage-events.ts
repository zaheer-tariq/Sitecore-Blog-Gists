import { engage } from 'lib/personalize/load-engage';
import { getCookie } from 'cookies-next';

const channel = 'Web';
const pos = process.env.NEXT_PUBLIC_SITECORE_PERSONALIZE_POS || '';

export const engageSendPageViewEvent = async (): Promise<void> => {
  if (!engage) return;

  try {
    const language = (getCookie('LOCALE') as string) || 'en';
    const currency = (getCookie('currency') as string) || 'USD';

    await engage.pageView({
      channel: channel,
      language: language,
      currency: currency,
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error sending personalize page view event:', error);
  }
};