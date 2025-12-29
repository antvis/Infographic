import Head from 'next/head';
import {useRouter} from 'next/router';
import Script from 'next/script';
import {useEffect} from 'react';

const EXAMPLES_PREFIX = '/examples';
const GALLERY_PREFIX = '/gallery';

function buildTarget(path: string) {
  if (path.startsWith(EXAMPLES_PREFIX)) {
    return `${GALLERY_PREFIX}${path.slice(EXAMPLES_PREFIX.length)}`;
  }
  return GALLERY_PREFIX;
}

export default function ExamplesRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const target = buildTarget(router.asPath || EXAMPLES_PREFIX);
    router.replace(target);
  }, [router]);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0;url=/gallery" />
        <link rel="canonical" href="/gallery" />
        <title>Redirecting...</title>
      </Head>
      <Script id="examples-redirect" strategy="beforeInteractive">{`
        (function () {
          var pathname = window.location.pathname || '';
          var search = window.location.search || '';
          var hash = window.location.hash || '';
          var prefix = '${EXAMPLES_PREFIX}';
          var targetBase = '${GALLERY_PREFIX}';
          var suffix = pathname.indexOf(prefix) === 0 ? pathname.slice(prefix.length) : '';
          window.location.replace(targetBase + suffix + search + hash);
        })();
      `}</Script>
    </>
  );
}
