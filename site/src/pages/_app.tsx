import {ConfigProvider, theme as antdTheme} from 'antd';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import Script from 'next/script';
import {useEffect, useMemo} from 'react';
import colors from '../../colors';
import {ContentReloader} from '../components/ContentReloader';
import '../components/ResourceLoader';
import {useTheme} from '../hooks/useTheme';
import {GA_MEASUREMENT_ID, pageview} from '../utils/analytics';

import 'antd/dist/reset.css';
import '../styles/index.css';
import '../styles/sandpack.css';

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();
  const themeMode = useTheme();
  const antdConfig = useMemo(
    () => ({
      algorithm:
        themeMode === 'dark'
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: colors.link,
        colorLink: colors.link,
        colorInfo: colors.link,
      },
    }),
    [themeMode]
  );

  useEffect(() => {
    // Taken from StackOverflow. Trying to detect both Safari desktop and mobile.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // This is kind of a lie.
      // We still rely on the manual Next.js scrollRestoration logic.
      // However, we *also* don't want Safari grey screen during the back swipe gesture.
      // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
      history.scrollRestoration = 'auto';
    } else {
      // For other browsers, let Next.js set scrollRestoration to 'manual'.
      // It seems to work better for Chrome and Firefox which don't animate the back swipe.
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
          `,
        }}
      />
      {process.env.NODE_ENV === 'development' && <ContentReloader />}
      <ConfigProvider theme={antdConfig}>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}
