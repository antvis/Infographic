import cn from 'classnames';
import {ExternalLink} from 'components/ExternalLink';
import {IconGitHub} from 'components/Icon/IconGitHub';
import NextLink from 'next/link';
import * as React from 'react';
import {getStoredLanguage, type Language} from '../../utils/i18n';
import {t} from '../../utils/translations';
import {IconAntV} from '../Icon/IconAntV';
import {Logo} from '../Logo';

type FooterTranslationSections = {
  docs: {
    header: string;
    quickStart: string;
    coreConcepts: string;
    customDesign: string;
    theory: string;
  };
  api: {
    header: string;
    jsx: string;
    api: string;
    designAssets: string;
  };
  more: {
    header: string;
    moreExamples: string;
    aiInfographic: string;
    github: string;
    contribute: string;
  };
  friendlyLinksHeader: string;
};

function getFooterTranslations(lang: Language): FooterTranslationSections {
  return {
    docs: {
      header: t(lang, 'footer.sections.docs.header'),
      quickStart: t(lang, 'footer.sections.docs.quickStart'),
      coreConcepts: t(lang, 'footer.sections.docs.coreConcepts'),
      customDesign: t(lang, 'footer.sections.docs.customDesign'),
      theory: t(lang, 'footer.sections.docs.theory'),
    },
    api: {
      header: t(lang, 'footer.sections.api.header'),
      jsx: t(lang, 'footer.sections.api.jsx'),
      api: t(lang, 'footer.sections.api.api'),
      designAssets: t(lang, 'footer.sections.api.designAssets'),
    },
    more: {
      header: t(lang, 'footer.sections.more.header'),
      moreExamples: t(lang, 'footer.sections.more.moreExamples'),
      aiInfographic: t(lang, 'footer.sections.more.aiInfographic'),
      github: t(lang, 'footer.sections.more.github'),
      contribute: t(lang, 'footer.sections.more.contribute'),
    },
    friendlyLinksHeader: t(lang, 'footer.friendlyLinksHeader'),
  };
}

export function Footer() {
  const [lang, setLang] = React.useState<Language>('zh-CN');

  React.useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
  const translations = getFooterTranslations(lang);
  return (
    <footer className={cn('text-secondary dark:text-secondary-dark')}>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1 justify-items-start mt-3.5">
          <ExternalLink aria-label="AntV" className="flex items-center gap-2">
            <Logo
              className={cn(
                'text-sm me-0 w-6 h-6 text-brand dark:text-brand-dark flex origin-center transition-all ease-in-out'
              )}
            />
            <span className="text-base font-bold text-primary dark:text-primary-dark">
              AntV Infographic
            </span>
          </ExternalLink>

          <div
            className="text-xs text-left rtl:text-right mt-2 pe-0.5"
            dir="ltr">
            Copyright &copy; Ant Group Co.
          </div>
          <div className="flex flex-row items-center mt-6 gap-x-2">
            <ExternalLink
              aria-label="AntV on GitHub"
              href="https://github.com/antvis/Infographic"
              className={socialLinkClasses}>
              <IconGitHub />
            </ExternalLink>
            <ExternalLink
              aria-label="AntV Site"
              href="https://antv.antgroup.com/"
              className={socialLinkClasses}>
              <IconAntV />
            </ExternalLink>
          </div>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/learn" isHeader={true}>
            {translations.docs.header}
          </FooterLink>
          <FooterLink href="/learn">{translations.docs.quickStart}</FooterLink>
          <FooterLink href="/learn/core-concepts">
            {translations.docs.coreConcepts}
          </FooterLink>
          <FooterLink href="/learn/custom-design">
            {translations.docs.customDesign}
          </FooterLink>
          <FooterLink href="/learn/infographic-theory">
            {translations.docs.theory}
          </FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/reference/infographic-api" isHeader={true}>
            {translations.api.header}
          </FooterLink>
          <FooterLink href="/reference/jsx">{translations.api.jsx}</FooterLink>
          <FooterLink href="/reference/api">{translations.api.api}</FooterLink>
          <FooterLink href="/reference/design-assets">
            {translations.api.designAssets}
          </FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink isHeader={true}>{translations.more.header}</FooterLink>
          <FooterLink href="/examples">
            {translations.more.moreExamples}
          </FooterLink>
          <FooterLink href="/ai">{translations.more.aiInfographic}</FooterLink>
          <FooterLink href="https://github.com/antvis/Infographic">
            {translations.more.github}
          </FooterLink>
          <FooterLink href="/learn/contributing">
            {translations.more.contribute}
          </FooterLink>
        </div>
        <div className="md:col-start-2 xl:col-start-5 flex flex-col">
          <FooterLink isHeader={true}>
            {translations.friendlyLinksHeader}
          </FooterLink>
          <FooterLink href="https://antv.antgroup.com/">AntV</FooterLink>
          <FooterLink href="https://g2.antv.antgroup.com/">G2</FooterLink>
          <FooterLink href="https://g6.antv.antgroup.com/">G6</FooterLink>
          <FooterLink href="https://l7.antv.antgroup.com/">L7</FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  isHeader = false,
}: {
  href?: string;
  children: React.ReactNode;
  isHeader?: boolean;
}) {
  const classes = cn('border-b inline-block border-transparent', {
    'text-sm text-primary dark:text-primary-dark': !isHeader,
    'text-md text-secondary dark:text-secondary-dark my-2 font-bold': isHeader,
    'hover:border-gray-10': href,
  });

  if (!href) {
    return <div className={classes}>{children}</div>;
  }

  if (href.startsWith('https://')) {
    return (
      <div>
        <ExternalLink href={href} className={classes}>
          {children}
        </ExternalLink>
      </div>
    );
  }

  return (
    <div>
      <NextLink href={href} className={classes}>
        {children}
      </NextLink>
    </div>
  );
}
