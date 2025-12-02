import Head from 'next/head';
import {Router, withRouter} from 'next/router';
import * as React from 'react';
import {finishedTranslations} from 'utils/finishedTranslations';
import {siteConfig} from '../siteConfig';

export interface SeoProps {
  title: string;
  titleForTitleTag: undefined | string;
  description?: string;
  image?: string;
  // jsonld?: JsonLDType | Array<JsonLDType>;
  children?: React.ReactNode;
  isHomePage: boolean;
  searchOrder?: number;
}

// If you are a maintainer of a language fork,
// deployedTranslations has been moved to src/utils/finishedTranslations.ts.

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'infographic.antv.vision';
}

export const Seo = withRouter(
  ({
    title,
    titleForTitleTag,
    image = '/images/og-default.png',
    router,
    children,
    isHomePage,
  }: SeoProps & {router: Router}) => {
    const siteDomain = getDomain(siteConfig.languageCode);
    const canonicalUrl = `https://${siteDomain}${
      router.asPath.split(/[\?\#]/)[0]
    }`;
    // Allow setting a different title for Google results
    const pageTitle =
      (titleForTitleTag ?? title) + (isHomePage ? '' : ' – AntV Infographic');
    // Twitter's meta parser is not very good.
    const twitterTitle = pageTitle.replace(/[<>]/g, '');
    let description = isHomePage
      ? 'AntV Infographic is a powerful visualization library for building interactive and customizable infographics. Create stunning visual stories with ease using our intuitive API and rich set of components.'
      : 'AntV Infographic - A powerful visualization library for building interactive and customizable infographics.';
    return (
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title != null && <title key="title">{pageTitle}</title>}
        {isHomePage && (
          // Let Google figure out a good description for each page.
          <meta name="description" key="description" content={description} />
        )}
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="alternate"
          href={canonicalUrl.replace(siteDomain, getDomain('en'))}
          hrefLang="x-default"
        />
        {finishedTranslations.map((languageCode) => (
          <link
            key={'alt-' + languageCode}
            rel="alternate"
            hrefLang={languageCode}
            href={canonicalUrl.replace(siteDomain, getDomain(languageCode))}
          />
        ))}
        <meta property="fb:app_id" content="623268441017527" />
        <meta property="og:type" key="og:type" content="website" />
        <meta property="og:url" key="og:url" content={canonicalUrl} />
        {title != null && (
          <meta property="og:title" content={pageTitle} key="og:title" />
        )}
        {description != null && (
          <meta
            property="og:description"
            key="og:description"
            content={description}
          />
        )}
        <meta
          property="og:image"
          key="og:image"
          content={`https://${siteDomain}${image}`}
        />
        {title != null && (
          <meta
            name="twitter:title"
            key="twitter:title"
            content={twitterTitle}
          />
        )}
        {description != null && (
          <meta
            name="twitter:description"
            key="twitter:description"
            content={description}
          />
        )}
        <meta
          name="twitter:image"
          key="twitter:image"
          content={`https://${siteDomain}${image}`}
        />
        <meta
          name="google-site-verification"
          content="sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Source-Code-Pro-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Source-Code-Pro-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://assets.antv.antgroup.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://assets.antv.antgroup.com/AlibabaPuHuiTi-Bold/result.css"
          as="style"
          crossOrigin="anonymous"
        />
        {children}
      </Head>
    );
  }
);
