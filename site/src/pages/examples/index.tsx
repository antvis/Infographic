import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function ExamplesRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const {asPath} = router;
    // Replace /examples with /gallery, keeping query params if any
    // For /examples, asPath is /examples or /examples?foo=bar
    const target = asPath.replace(/^\/examples/, '/gallery');

    router.replace(target);
  }, [router.isReady, router.asPath, router]);

  return null;
}
