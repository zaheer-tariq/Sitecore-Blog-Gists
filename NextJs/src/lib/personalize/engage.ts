import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { engage, loadEngage } from 'lib/personalize/load-engage';
import { engageSendPageViewEvent } from 'lib/personalize/engage-events';

const useEngage = (): void => {
  const router = useRouter();

  useEffect(() => {
    const initializeEngage = async (): Promise<void> => {
      try {
        await loadEngage(); // Ensure Engage is loaded
        if (engage) {
          engageSendPageViewEvent();
        } else {
          console.error('Engage is still not initialized');
        }
      } catch (error) {
        console.error('Error initializing Engage:', error);
      }
    };
    initializeEngage();
  }, [router.asPath]);
};

export default useEngage;
