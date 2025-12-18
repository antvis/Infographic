import type {HTMLAttributes} from 'react';
import * as React from 'react';
import {useContext, useMemo} from 'react';

import ButtonLink from 'components/ButtonLink';
import {finishedTranslations} from 'utils/finishedTranslations';
import {IconNavArrow} from '../Icon/IconNavArrow';
import BlogCard from './BlogCard';
import CodeBlock from './CodeBlock';
import {ConsoleBlock, ConsoleBlockMulti, ConsoleLogLine} from './ConsoleBlock';
import ExpandableCallout from './ExpandableCallout';
import ExpandableExample from './ExpandableExample';
import {H1, H2, H3, H4, H5} from './Heading';
import InlineCode from './InlineCode';
import Intro from './Intro';
import {LanguagesContext} from './LanguagesContext';
import Link from './Link';
import {PackageImport} from './PackageImport';
import type {Toc, TocItem} from './TocContext';
import {TocContext} from './TocContext';

import ErrorDecoder from './ErrorDecoder';
import {
  CodeRunner,
  InfographicBlock as Infographic,
  InfographicStreamRunner,
} from './InfographicPlayground';

const P = (p: HTMLAttributes<HTMLParagraphElement>) => (
  <p className="whitespace-pre-wrap my-4" {...p} />
);

const Strong = (strong: HTMLAttributes<HTMLElement>) => (
  <strong className="font-bold" {...strong} />
);

const OL = (p: HTMLAttributes<HTMLOListElement>) => (
  <ol className="ms-6 my-3 list-decimal" {...p} />
);
const LI = (p: HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-relaxed mb-1" {...p} />
);
const UL = (p: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ms-6 my-3 list-disc" {...p} />
);

const Divider = () => (
  <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />
);

const Warning = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="warning">{children}</ExpandableCallout>
);

const Note = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="note">{children}</ExpandableCallout>
);

const Blockquote = ({children, ...props}: HTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote
      className="mdx-blockquote py-4 px-8 my-8 shadow-inner-border dark:shadow-inner-border-dark bg-highlight dark:bg-highlight-dark bg-opacity-50 rounded-2xl leading-6 flex relative"
      {...props}>
      <span className="block relative">{children}</span>
    </blockquote>
  );
};

function LearnMore({
  children,
  path,
}: {
  title: string;
  path?: string;
  children: any;
}) {
  return (
    <>
      <section className="p-8 mt-16 mb-16 flex flex-row shadow-inner-border dark:shadow-inner-border-dark justify-between items-center bg-card dark:bg-card-dark rounded-2xl">
        <div className="flex-col">
          <h2 className="text-primary font-display dark:text-primary-dark font-bold text-2xl leading-tight">
            Ready to learn this topic?
          </h2>
          {children}
          {path ? (
            <ButtonLink
              className="mt-1"
              label="Read More"
              href={path}
              type="primary">
              Read More
              <IconNavArrow displayDirection="end" className="inline ms-1" />
            </ButtonLink>
          ) : null}
        </div>
      </section>
      <hr className="border-border dark:border-border-dark mb-14" />
    </>
  );
}

function Math({children}: {children: any}) {
  return (
    <span
      style={{
        fontFamily: 'STIXGeneral-Regular, Georgia, serif',
        fontSize: '1.2rem',
      }}>
      {children}
    </span>
  );
}

function MathI({children}: {children: any}) {
  return (
    <span
      style={{
        fontFamily: 'STIXGeneral-Italic, Georgia, serif',
        fontSize: '1.2rem',
      }}>
      {children}
    </span>
  );
}

type NestedTocRoot = {
  item: null;
  children: Array<NestedTocNode>;
};

type NestedTocNode = {
  item: TocItem;
  children: Array<NestedTocNode>;
};

function calculateNestedToc(toc: Toc): NestedTocRoot {
  const currentAncestors = new Map<number, NestedTocNode | NestedTocRoot>();
  const root: NestedTocRoot = {
    item: null,
    children: [],
  };
  const startIndex = 1; // Skip "Overview"
  for (let i = startIndex; i < toc.length; i++) {
    const item = toc[i];
    const currentParent: NestedTocNode | NestedTocRoot =
      currentAncestors.get(item.depth - 1) || root;
    const node: NestedTocNode = {
      item,
      children: [],
    };
    currentParent.children.push(node);
    currentAncestors.set(item.depth, node);
  }
  return root;
}

function InlineToc() {
  const toc = useContext(TocContext);
  const root = useMemo(() => calculateNestedToc(toc), [toc]);
  if (root.children.length < 2) {
    return null;
  }
  return <InlineTocItem items={root.children} />;
}

function InlineTocItem({items}: {items: Array<NestedTocNode>}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.text}</Link>
          {node.children.length > 0 && <InlineTocItem items={node.children} />}
        </LI>
      ))}
    </UL>
  );
}

type TranslationProgress = 'complete' | 'in-progress';

function LanguageList({progress}: {progress: TranslationProgress}) {
  const allLanguages = React.useContext(LanguagesContext) ?? [];
  const languages = allLanguages
    .filter(
      ({code}) =>
        code !== 'en' &&
        (progress === 'complete'
          ? finishedTranslations.includes(code)
          : !finishedTranslations.includes(code))
    )
    .sort((a, b) => a.enName.localeCompare(b.enName));
  return (
    <UL>
      {languages.map(({code, name, enName}) => {
        return (
          <LI key={code}>
            <Link href={`https://${code}.react.dev/`}>
              {enName} ({name})
            </Link>{' '}
            &mdash;{' '}
            <Link href={`https://github.com/reactjs/${code}.react.dev`}>
              Contribute
            </Link>
          </LI>
        );
      })}
    </UL>
  );
}

function Image(props: any) {
  const {alt, ...rest} = props;
  return <img alt={alt} className="max-w-[calc(min(700px,100%))]" {...rest} />;
}

export const MDXComponents = {
  p: P,
  strong: Strong,
  blockquote: Blockquote,
  ol: OL,
  ul: UL,
  li: LI,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  hr: Divider,
  a: Link,
  img: Image,
  BlogCard,
  code: InlineCode,
  pre: CodeBlock,
  ConsoleBlock,
  ConsoleBlockMulti,
  ConsoleLogLine,
  DeepDive: (props: {
    children: React.ReactNode;
    title: string;
    excerpt: string;
  }) => <ExpandableExample {...props} type="DeepDive" />,
  FullWidth({children}: {children: any}) {
    return children;
  },
  MaxWidth({children}: {children: any}) {
    return <div className="max-w-4xl ms-0 2xl:mx-auto">{children}</div>;
  },
  Warning,
  Infographic,
  InfographicStreamRunner,
  CodeRunner,
  Intro,
  InlineToc,
  LanguageList,
  LearnMore,
  Math,
  MathI,
  Note,
  PackageImport,
  ErrorDecoder,
};

for (let key in MDXComponents) {
  if (MDXComponents.hasOwnProperty(key)) {
    const MDXComponent: any = (MDXComponents as any)[key];
    MDXComponent.mdxName = key;
  }
}
