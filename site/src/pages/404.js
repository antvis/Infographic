import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const {asPath} = router;
      if (
        asPath === '/examples' ||
        asPath.startsWith('/examples/') ||
        asPath.startsWith('/examples?')
      ) {
        const target = asPath.replace(/^\/examples/, '/gallery');
        router.replace(target);
      }
    }
  }, [router.isReady, router.asPath, router]);

  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/antvis/Infographic/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
