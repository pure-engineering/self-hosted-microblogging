import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

import Header from '~/components/header';
import Breadcrumbs from '~/components/breadcrumbs';

// Create a GrowthBook instance
const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    // eslint-disable-next-line no-console
    console.log({
      experimentId: experiment.key,
      variationId: result.variationId,
    });
  },
});

function App() {
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`App version: ${APP_VERSION}`);

    const controller = new AbortController();

    // Load feature definitions from API once.
    fetch(
      `https://cdn.growthbook.io/api/features/${
        import.meta.env.VITE_GROWTH_BOOK_KEY
      }`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        // eslint-disable-next-line no-console
        console.error('Failed to load GrowthBook features', error);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    growthbook.setAttributes({
      url: window.location.href,
      browser: navigator.userAgent,
      loggedIn: false,
    });
  }, [location]);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <Header />
      {location.pathname !== '/' && <Breadcrumbs />}
      <Outlet />
    </GrowthBookProvider>
  );
}

export default App;
