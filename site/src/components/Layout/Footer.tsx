import cn from 'classnames';
import {ExternalLink} from 'components/ExternalLink';
import {IconGitHub} from 'components/Icon/IconGitHub';
import NextLink from 'next/link';
import * as React from 'react';
import {useLocaleBundle} from '../../hooks/useTranslation';
import {IconAntV} from '../Icon/IconAntV';
import {Logo} from '../Logo';

const TRANSLATIONS = {
  'zh-CN': {
    docs: {
      header: '文档',
      quickStart: '快速开始',
      coreConcepts: '核心概念',
      customDesign: '自定义设计',
      theory: '信息图理论',
    },
    api: {
      header: 'API 参考',
      jsx: 'JSX',
      api: 'API',
      designAssets: '设计资产',
    },
    more: {
      header: '更多',
      moreExamples: '更多示例',
      aiInfographic: 'AI 生成信息图',
      github: 'GitHub',
      contribute: '参与贡献',
    },
    friendlyLinksHeader: '友情链接',
  },
  'en-US': {
    docs: {
      header: 'Docs',
      quickStart: 'Quick Start',
      coreConcepts: 'Core Concepts',
      customDesign: 'Custom Design',
      theory: 'Infographic Theory',
    },
    api: {
      header: 'API Reference',
      jsx: 'JSX',
      api: 'API',
      designAssets: 'Design Assets',
    },
    more: {
      header: 'More',
      moreExamples: 'More Examples',
      aiInfographic: 'AI Generated Infographics',
      github: 'GitHub',
      contribute: 'Contribute',
    },
    friendlyLinksHeader: 'Friendly Links',
  },
};

export function Footer() {
  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
  const translations = useLocaleBundle(TRANSLATIONS);
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
