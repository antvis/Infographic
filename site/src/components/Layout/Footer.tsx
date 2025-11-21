import cn from 'classnames';
import {ExternalLink} from 'components/ExternalLink';
import {IconGitHub} from 'components/Icon/IconGitHub';
import NextLink from 'next/link';
import * as React from 'react';
import {IconAntV} from '../Icon/IconAntV';
import {Logo} from '../Logo';

export function Footer() {
  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
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
            文档
          </FooterLink>
          <FooterLink href="/learn">快速开始</FooterLink>
          <FooterLink href="/learn/core-concepts">核心概念</FooterLink>
          <FooterLink href="/learn/custom-design">自定义设计</FooterLink>
          <FooterLink href="/learn/infographic-theory">信息图理论</FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/reference" isHeader={true}>
            API 参考
          </FooterLink>
          <FooterLink href="/reference/jsx">JSX</FooterLink>
          <FooterLink href="/reference/api">API</FooterLink>
          <FooterLink href="/reference/design-assets">设计资产</FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink isHeader={true}>更多</FooterLink>
          <FooterLink href="/examples">更多示例</FooterLink>
          <FooterLink href="/ai">AI 在线体验</FooterLink>
          <FooterLink href="https://github.com/antvis/Infographic">
            GitHub
          </FooterLink>
          <FooterLink href="/learn/contributing">参与贡献</FooterLink>
        </div>
        <div className="md:col-start-2 xl:col-start-5 flex flex-col">
          <FooterLink isHeader={true}>友情链接</FooterLink>
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
