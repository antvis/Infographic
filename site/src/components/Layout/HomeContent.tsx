import cn from 'classnames';
import NextLink from 'next/link';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
  type RefObject,
} from 'react';

import {VERSION} from '@antv/infographic';
import {ExternalLink} from 'components/ExternalLink';
import {IconChevron} from 'components/Icon/IconChevron';
import {IconGitHub} from 'components/Icon/IconGitHub';
import {Logo} from 'components/Logo';
import BlogCard from 'components/MDX/BlogCard';
import CodeBlock from 'components/MDX/CodeBlock';
import { IconStarTwinkle } from 'components/Icon/IconStarTwinkle';
import ButtonLink from '../ButtonLink';
import {AIInfographicFlow} from './HomePage/AIInfographicFlow';
import {CodePlayground} from './HomePage/CodePlayground';
import {Gallery} from './HomePage/Gallery';
import {QuickStartDemo, QuickStartDemoCode} from './HomePage/QuickStartDemo';
import {StylizeDemo} from './HomePage/StylizeDemo';

type SectionBackground = 'left-card' | 'right-card' | null;

interface SectionProps {
  children: ReactNode;
  background?: SectionBackground;
}

interface BasicProps {
  children: ReactNode;
}

interface CTAProps {
  children: ReactNode;
  icon: 'native' | 'framework' | 'code' | 'news';
  href: string;
  color?: string;
}

interface Feature {
  title: string;
  detail: string;
}

interface ActiveArea {
  name: string;
}

interface ExampleLayoutProps {
  left: ReactNode;
  right: ReactNode;
  activeArea?: ActiveArea;
  hoverTopOffset?: number;
}

interface ExamplePanelProps {
  children: ReactNode;
  noPadding?: boolean;
  noShadow?: boolean;
  height?: CSSProperties['height'];
  contentMarginTop?: CSSProperties['marginTop'];
}

console.log('AntV Infographic version:', VERSION);

function Section({children, background = null}: SectionProps) {
  return (
    <div
      className={cn(
        'mx-auto flex flex-col w-full',
        background === null && 'max-w-7xl',
        background === 'left-card' &&
          'bg-gradient-left dark:bg-gradient-left-dark border-t border-primary/10 dark:border-primary-dark/10 ',
        background === 'right-card' &&
          'bg-gradient-right dark:bg-gradient-right-dark border-t border-primary/5 dark:border-primary-dark/5'
      )}
      style={{
        contain: 'content',
      }}>
      <div className="flex-col gap-2 flex grow w-full my-20 lg:my-32 mx-auto items-center">
        {children}
      </div>
    </div>
  );
}

function Header({children}: BasicProps) {
  return (
    <h2 className="leading-xl font-display text-primary dark:text-primary-dark font-semibold text-5xl lg:text-6xl -mt-4 mb-7 w-full max-w-3xl lg:max-w-xl">
      {children}
    </h2>
  );
}

function Para({children}: BasicProps) {
  return (
    <p className="max-w-3xl mx-auto text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-normal">
      {children}
    </p>
  );
}

function Center({children}: BasicProps) {
  return (
    <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-white text-opacity-80 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

function FullBleed({children}: BasicProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col w-full">{children}</div>
  );
}

const features: Feature[] = [
  {
    title: '信息图语法',
    detail: '贴合信息图特性的声明式语法，涵盖布局、元素、主题',
  },
  {
    title: 'JSX 定制开发',
    detail: '以 JSX 描述设计资产，直观可复用，灵活扩展',
  },
  {
    title: '风格化渲染',
    detail: '一套模板多种风格，支持手绘、纹理、渐变等效果',
  },
  {
    title: '可视化编辑',
    detail: '可交互增删数据项，添加图形与标注，所见即所得',
  },
];

export function HomeContent(): JSX.Element {
  return (
    <>
      <div className="ps-0">
        {/* Hero section with pink gradient background */}
        <div className="relative isolate overflow-hidden">
          {/* Background decorations - matching AI page */}
          <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

          <div className="mx-5 mt-4 lg:mt-12 mb-8 lg:mb-16 flex flex-col justify-center relative z-10">
            <Logo
              className={cn(
                'mt-4 mb-3 text-brand dark:text-brand-dark w-24 lg:w-28 self-center text-sm me-0 flex origin-center transition-all ease-in-out'
              )}
            />
            <h1 className="text-5xl font-display lg:text-6xl self-center flex font-semibold leading-snug text-primary dark:text-primary-dark">
              AntV Infographic
            </h1>
            <p className="text-4xl font-display max-w-lg md:max-w-full py-1 text-center text-secondary dark:text-primary-dark leading-snug self-center">
              新一代信息图可视化引擎
            </p>
            <div className="mt-5 self-center flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
              <ButtonLink
                href={'/ai'}
                type="primary"
                size="lg"
                className="w-full sm:w-auto justify-center"
                label="AI Infographic">
                <IconStarTwinkle className="w-6 h-6" />
                <span className="font-semibold">AI Infographic</span>
              </ButtonLink>
              <ButtonLink
                href={'/learn'}
                type="secondary"
                size="lg"
                className="w-full sm:w-auto justify-center"
                label="快速开始">
                快速开始
              </ButtonLink>
              <ExternalLink
                href="https://github.com/antvis/infographic"
                aria-label="AntV Infographic on GitHub"
                className="inline-flex items-center justify-center gap-2 text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 text-lg px-4 py-3 rounded-full min-w-[52px] focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark">
                <IconGitHub className="w-6 h-6" />
                <span className="font-semibold">GitHub</span>
              </ExternalLink>
            </div>
            <Gallery />
          </div>
        </div>

        <Section background="left-card">
          <Center>
            <Header>声明式信息图渲染框架</Header>
            <Para>
              <Code>声明式</Code>{' '}
              配置描述信息图，让数据叙事更简单、更优雅、更高效
            </Para>
          </Center>
          <FullBleed>
            <ExampleLayout
              left={
                <CodeBlock
                  isFromPackageImport={false}
                  noShadow={true}
                  noMargin={true}
                  showCopy={false}>
                  <div>{QuickStartDemoCode}</div>
                </CodeBlock>
              }
              right={
                <ExamplePanel>
                  <QuickStartDemo />
                </ExamplePanel>
              }
            />
          </FullBleed>
          <Center>
            <Para>
              100+ 内置模板与组件，开箱可用；从 0 到 1 构建信息图，从未如此轻松
            </Para>
          </Center>
        </Section>

        <Section background="right-card">
          <Center>
            <Header>AI 轻松生成专业信息图</Header>
            <Para>
              让 AI 理解文本，抽取关键信息并生成配置，一键渲染专业信息图
            </Para>
          </Center>
          <FullBleed>
            <AIInfographicFlow />
          </FullBleed>
          <Center>
            <Para>无需设计经验，AI 完成从内容理解到可视化呈现的全流程</Para>
            <div className="mt-5">
              <ButtonLink
                href={'/ai'}
                type="primary"
                size="lg"
                className="w-full sm:w-auto justify-center"
                label="前往体验">
                前往体验
              </ButtonLink>
            </div>
          </Center>
        </Section>

        <Section background="left-card">
          <Center>
            <Header>多样主题效果</Header>
            <Para>一键切换风格，满足不同场景需求</Para>
          </Center>
          <FullBleed>
            <div className="flex justify-center px-5">
              <StylizeDemo />
            </div>
          </FullBleed>
          <Center>
            <Para>支持自定义主题配置，灵活扩展样式系统</Para>
            <div className="flex justify-start w-full lg:justify-center">
              <CTA color="gray" icon="code" href="/learn/theme">
                查看主题配置文档
              </CTA>
            </div>
          </Center>
        </Section>

        <Section background="right-card">
          <Center>
            <Header>在线体验</Header>
            <Para>
              在线编辑器中创建你的第一张信息图。用简洁配置快速完成可视化，实时预览即改即见
            </Para>
          </Center>
          <FullBleed>
            <CodePlayground />
          </FullBleed>
          <Center>
            <Para>
              无需安装，在浏览器即可创作。丰富示例助你快速上手，轻松打造专业信息图
            </Para>
            <div className="flex justify-start w-full lg:justify-center">
              <CTA color="gray" icon="framework" href="/examples">
                查看更多示例
              </CTA>
            </div>
          </Center>
        </Section>

        <Section background="right-card">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row px-5">
            <div className="max-w-3xl lg:max-w-7xl gap-5 flex flex-col lg:flex-row lg:px-5">
              <div className="w-full lg:w-6/12 max-w-3xl flex flex-col items-start justify-start lg:ps-5 lg:pe-10">
                <Header>持续演进，拥抱未来</Header>
                <Para>目标：让信息图成为 AI 时代的视觉语言基础设施</Para>
                <div className="order-last pt-5 w-full">
                  <div className="flex flex-row justify-between items-center gap-3 mt-5 lg:-mt-2 w-full">
                    <p className="uppercase tracking-wide font-bold text-sm text-tertiary dark:text-tertiary-dark flex flex-row gap-2 items-center">
                      <IconChevron />
                      特性
                    </p>
                    <p className="uppercase tracking-wide font-bold text-sm text-tertiary dark:text-tertiary-dark flex flex-row gap-2 items-center">
                      未来计划
                      <IconChevron displayDirection="right" />
                    </p>
                  </div>
                  <div className="flex-col sm:flex-row flex-wrap flex gap-5 text-start my-5">
                    <div className="flex-1 min-w-[40%] text-start">
                      <BlogCard {...features[0]} />
                    </div>
                    <div className="flex-1 min-w-[40%] text-start">
                      <BlogCard {...features[1]} />
                    </div>
                    <div className="flex-1 min-w-[40%] text-start">
                      <BlogCard {...features[2]} />
                    </div>
                    <div className="hidden sm:flex-1 sm:inline">
                      <BlogCard {...features[3]} />
                    </div>
                  </div>
                  <div className="flex lg:hidden justify-start w-full">
                    <CTA color="gray" icon="news" href="">
                      了解更多动态
                    </CTA>
                  </div>
                  {/* <div className="hidden lg:flex justify-start w-full">
                    <CTA color="gray" icon="news" href="">
                      了解更多动态
                    </CTA>
                  </div> */}
                </div>
              </div>
              <div className="w-full lg:w-6/12 flex flex-col items-center lg:items-end">
                <img
                  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*15OrQo7ftkAAAAAASxAAAAgAemJ7AQ/original"
                  alt="AntV Infographic 团队技术探索示意"
                  className="w-full h-auto rounded-2xl lg:max-h-[480px] object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section background="left-card">
          <div className="mt-20 px-5 lg:px-0 mb-6 max-w-4xl text-center text-opacity-80">
            <Logo className="text-brand dark:text-brand-dark w-24 lg:w-28 mb-10 lg:mb-8 mt-12 h-auto mx-auto self-start" />
            <Header>
              欢迎使用 <br className="hidden lg:inline" />
              AntV Infographic
            </Header>
            <ButtonLink
              href={'/learn'}
              type="primary"
              size="lg"
              label="立即开始">
              立即开始
            </ButtonLink>
          </div>
        </Section>
      </div>
    </>
  );
}

function renderCTAIcon(icon: CTAProps['icon']) {
  if (icon === 'native') {
    return (
      <svg
        className="me-2.5 text-primary dark:text-primary-dark"
        fill="none"
        width="24"
        height="24"
        viewBox="0 0 72 72"
        aria-hidden="true">
        <g clipPath="url(#clip0_8_10998)">
          <path
            d="M54.0001 15H18.0001C16.3432 15 15.0001 16.3431 15.0001 18V42H33V48H12.9567L9.10021 57L24.0006 57C24.0006 55.3431 25.3437 54 27.0006 54H33V57.473C33 59.3786 33.3699 61.2582 34.0652 63H9.10021C4.79287 63 1.88869 58.596 3.5852 54.6368L9.0001 42V18C9.0001 13.0294 13.0295 9 18.0001 9H54.0001C58.9707 9 63.0001 13.0294 63.0001 18V25.4411C62.0602 25.0753 61.0589 24.8052 60.0021 24.6458C59.0567 24.5032 58.0429 24.3681 57.0001 24.2587V18C57.0001 16.3431 55.6569 15 54.0001 15Z"
            fill="currentColor"
          />
          <path
            d="M48 42C48 40.3431 49.3431 39 51 39H54C55.6569 39 57 40.3431 57 42C57 43.6569 55.6569 45 54 45H51C49.3431 45 48 43.6569 48 42Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45.8929 30.5787C41.8093 31.1947 39 34.8257 39 38.9556V57.473C39 61.6028 41.8093 65.2339 45.8929 65.8499C48.0416 66.174 50.3981 66.4286 52.5 66.4286C54.6019 66.4286 56.9584 66.174 59.1071 65.8499C63.1907 65.2339 66 61.6028 66 57.473V38.9556C66 34.8258 63.1907 31.1947 59.1071 30.5787C56.9584 30.2545 54.6019 30 52.5 30C50.3981 30 48.0416 30.2545 45.8929 30.5787ZM60 57.473V38.9556C60 37.4615 59.0438 36.637 58.2121 36.5116C56.2014 36.2082 54.1763 36 52.5 36C50.8237 36 48.7986 36.2082 46.7879 36.5116C45.9562 36.637 45 37.4615 45 38.9556V57.473C45 58.9671 45.9562 59.7916 46.7879 59.917C48.7986 60.2203 50.8237 60.4286 52.5 60.4286C54.1763 60.4286 56.2014 60.2203 58.2121 59.917C59.0438 59.7916 60 58.9671 60 57.473Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_8_10998">
            <rect width="72" height="72" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (icon === 'framework') {
    return (
      <svg
        className="me-2.5 text-primary dark:text-primary-dark"
        fill="none"
        width="24"
        height="24"
        viewBox="0 0 72 72"
        aria-hidden="true">
        <g clipPath="url(#clip0_10_21081)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.9136 29.0343C46.8321 26.9072 48 24.09 48 21C48 14.3726 42.6274 9 36 9C29.3726 9 24 14.3726 24 21C24 24.0904 25.1682 26.9079 27.0871 29.0351L21.0026 39.3787C20.0429 39.1315 19.0368 39 18 39C11.3726 39 6 44.3726 6 51C6 57.6274 11.3726 63 18 63C23.5915 63 28.2898 59.1757 29.6219 54H42.3781C43.7102 59.1757 48.4085 63 54 63C60.6274 63 66 57.6274 66 51C66 44.3726 60.6274 39 54 39C52.9614 39 51.9537 39.1319 50.9926 39.38L44.9136 29.0343ZM42 21C42 24.3137 39.3137 27 36 27C32.6863 27 30 24.3137 30 21C30 17.6863 32.6863 15 36 15C39.3137 15 42 17.6863 42 21ZM39.9033 32.3509C38.6796 32.7716 37.3665 33 36 33C34.6338 33 33.321 32.7717 32.0975 32.3512L26.2523 42.288C27.8635 43.8146 29.0514 45.7834 29.6219 48H42.3781C42.9482 45.785 44.1348 43.8175 45.7441 42.2913L39.9033 32.3509ZM54 57C50.6863 57 48 54.3137 48 51C48 47.6863 50.6863 45 54 45C57.3137 45 60 47.6863 60 51C60 54.3137 57.3137 57 54 57ZM24 51C24 47.6863 21.3137 45 18 45C14.6863 45 12 47.6863 12 51C12 54.3137 14.6863 57 18 57C21.3137 57 24 54.3137 24 51Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_10_21081">
            <rect width="72" height="72" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (icon === 'code') {
    return (
      <svg
        className="me-2.5 text-primary dark:text-primary-dark"
        fill="none"
        width="24"
        height="24"
        viewBox="0 0 72 72"
        aria-hidden="true">
        <g clipPath="url(#clip0_8_9064)">
          <path
            d="M44.7854 22.1142C45.4008 20.5759 44.6525 18.83 43.1142 18.2146C41.5758 17.5993 39.8299 18.3475 39.2146 19.8859L27.2146 49.8859C26.5992 51.4242 27.3475 53.1702 28.8858 53.7855C30.4242 54.4008 32.1701 53.6526 32.7854 52.1142L44.7854 22.1142Z"
            fill="currentColor"
          />
          <path
            d="M9.87868 38.1214C8.70711 36.9498 8.70711 35.0503 9.87868 33.8787L18.8787 24.8787C20.0503 23.7072 21.9497 23.7072 23.1213 24.8787C24.2929 26.0503 24.2929 27.9498 23.1213 29.1214L16.2426 36.0001L23.1213 42.8787C24.2929 44.0503 24.2929 45.9498 23.1213 47.1214C21.9497 48.293 20.0503 48.293 18.8787 47.1214L9.87868 38.1214Z"
            fill="currentColor"
          />
          <path
            d="M62.1213 33.8787L53.1213 24.8787C51.9497 23.7072 50.0503 23.7072 48.8787 24.8787C47.7071 26.0503 47.7071 27.9498 48.8787 29.1214L55.7574 36.0001L48.8787 42.8787C47.7071 44.0503 47.7071 45.9498 48.8787 47.1214C50.0503 48.293 51.9497 48.293 53.1213 47.1214L62.1213 38.1214C63.2929 36.9498 63.2929 35.0503 62.1213 33.8787Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_8_9064">
            <rect width="72" height="72" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      className="me-2.5 text-primary dark:text-primary-dark"
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 72 72"
      aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7101 56.3758C13.0724 56.7251 13.6324 57 14.3887 57H57.6113C58.3676 57 58.9276 56.7251 59.2899 56.3758C59.6438 56.0346 59.8987 55.5407 59.9086 54.864C59.9354 53.022 59.9591 50.7633 59.9756 48H12.0244C12.0409 50.7633 12.0645 53.022 12.0914 54.864C12.1013 55.5407 12.3562 56.0346 12.7101 56.3758ZM12.0024 42H59.9976C59.9992 41.0437 60 40.0444 60 39C60 29.5762 59.9327 22.5857 59.8589 17.7547C59.8359 16.2516 58.6168 15 56.9938 15L15.0062 15C13.3832 15 12.1641 16.2516 12.1411 17.7547C12.0673 22.5857 12 29.5762 12 39C12 40.0444 12.0008 41.0437 12.0024 42ZM65.8582 17.6631C65.7843 12.8227 61.8348 9 56.9938 9H15.0062C10.1652 9 6.21572 12.8227 6.1418 17.6631C6.06753 22.5266 6 29.5477 6 39C6 46.2639 6.03988 51.3741 6.09205 54.9515C6.15893 59.537 9.80278 63 14.3887 63H57.6113C62.1972 63 65.8411 59.537 65.9079 54.9515C65.9601 51.3741 66 46.2639 66 39C66 29.5477 65.9325 22.5266 65.8582 17.6631ZM39 21C37.3431 21 36 22.3431 36 24C36 25.6569 37.3431 27 39 27H51C52.6569 27 54 25.6569 54 24C54 22.3431 52.6569 21 51 21H39ZM36 33C36 31.3431 37.3431 30 39 30H51C52.6569 30 54 31.3431 54 33C54 34.6569 52.6569 36 51 36H39C37.3431 36 36 34.6569 36 33ZM24 33C27.3137 33 30 30.3137 30 27C30 23.6863 27.3137 21 24 21C20.6863 21 18 23.6863 18 27C18 30.3137 20.6863 33 24 33Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CTA({children, icon, href}: CTAProps) {
  const linkClassName =
    'focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark group cursor-pointer w-auto justify-center inline-flex font-bold items-center mt-10 outline-none hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 leading-tight hover:bg-opacity-80 text-lg py-2.5 rounded-full px-4 sm:px-6 ease-in-out shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark text-primary dark:text-primary-dark';
  const content = (
    <>
      {renderCTAIcon(icon)}
      {children}
      <svg
        className="text-primary dark:text-primary-dark rtl:rotate-180"
        fill="none"
        width="24"
        height="24"
        viewBox="0 0 72 72"
        aria-hidden="true">
        <path
          className="transition-transform ease-in-out translate-x-[-8px] group-hover:translate-x-[8px]"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40.0001 19.0245C41.0912 17.7776 42.9864 17.6513 44.2334 18.7423L58.9758 33.768C59.6268 34.3377 60.0002 35.1607 60.0002 36.0257C60.0002 36.8908 59.6268 37.7138 58.9758 38.2835L44.2335 53.3078C42.9865 54.3988 41.0913 54.2725 40.0002 53.0256C38.9092 51.7786 39.0355 49.8835 40.2824 48.7924L52.4445 36.0257L40.2823 23.2578C39.0354 22.1667 38.9091 20.2714 40.0001 19.0245Z"
          fill="currentColor"
        />
        <path
          className="opacity-0 ease-in-out transition-opacity group-hover:opacity-100"
          d="M60 36.0273C60 37.6842 58.6569 39.0273 57 39.0273H15C13.3431 39.0273 12 37.6842 12 36.0273C12 34.3704 13.3431 33.0273 15 33.0273H57C58.6569 33.0273 60 34.3704 60 36.0273Z"
          fill="currentColor"
        />
      </svg>
    </>
  );

  if (href.startsWith('https://')) {
    return (
      <ExternalLink href={href} className={linkClassName}>
        {content}
      </ExternalLink>
    );
  }

  return (
    <NextLink href={href} legacyBehavior={false} className={linkClassName}>
      {content}
    </NextLink>
  );
}

function ExampleLayout({
  left,
  right,
  activeArea,
  hoverTopOffset = 0,
}: ExampleLayoutProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  useNestedScrollLock(contentRef);

  const [overlayStyles, setOverlayStyles] = useState<CSSProperties[]>([]);

  useEffect(() => {
    const contentNode = contentRef.current;
    if (!activeArea || !contentNode) {
      setOverlayStyles([]);
      return;
    }

    const nodes = contentNode.querySelectorAll<HTMLElement>(
      `[data-hover="${activeArea.name}"]`
    );
    const parentRect = contentNode.getBoundingClientRect();
    const nextOverlayStyles = Array.from(nodes)
      .map((node) => {
        const nodeRect = node.getBoundingClientRect();
        let top = Math.round(nodeRect.top - parentRect.top) - 8;
        let bottom = Math.round(nodeRect.bottom - parentRect.top) + 8;
        const leftOffset = Math.round(nodeRect.left - parentRect.left) - 8;
        const rightOffset = Math.round(nodeRect.right - parentRect.left) + 8;
        top = Math.max(top, hoverTopOffset);
        bottom = Math.min(bottom, parentRect.height - 12);
        if (top >= bottom) {
          return null;
        }
        return {
          width: `${rightOffset - leftOffset}px`,
          height: `${bottom - top}px`,
          transform: `translate(${leftOffset}px, ${top}px)`,
        } as CSSProperties;
      })
      .filter(Boolean) as CSSProperties[];
    setOverlayStyles(nextOverlayStyles);
  }, [activeArea, hoverTopOffset]);

  return (
    <div className="lg:ps-10 lg:pe-5 w-full">
      <div className="mt-12 mb-2 lg:my-16 max-w-7xl mx-auto flex flex-col w-full lg:rounded-2xl lg:bg-card lg:dark:bg-card-dark">
        <div className="flex-col gap-0 lg:gap-5 lg:rounded-2xl lg:bg-gray-10 lg:dark:bg-gray-70 shadow-inner-border dark:shadow-inner-border-dark lg:flex-row flex grow w-full mx-auto items-center bg-cover bg-center lg:bg-right ltr:lg:bg-[length:60%_100%] bg-no-repeat bg-meta-gradient dark:bg-meta-gradient-dark">
          <div className="lg:-m-5 h-full shadow-nav dark:shadow-nav-dark lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col">
            {left}
          </div>
          <div
            ref={contentRef}
            className="relative mt-0 lg:-my-20 w-full p-2.5 xs:p-5 lg:p-10 flex grow justify-center"
            dir="ltr">
            {right}
            <div
              className={cn(
                'absolute z-10 inset-0 pointer-events-none transition-opacity transform-gpu',
                activeArea ? 'opacity-100' : 'opacity-0'
              )}>
              {overlayStyles.map((styles, i) => (
                <div
                  key={i}
                  className="top-0 start-0 bg-blue-30/5 border-2 border-link dark:border-link-dark absolute rounded-lg"
                  style={styles}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useNestedScrollLock(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    let isLocked = false;
    let lastScroll = performance.now();

    function handleScroll() {
      if (!isLocked) {
        isLocked = true;
        node!.style.pointerEvents = 'none';
      }
      lastScroll = performance.now();
    }

    function updateLock() {
      if (isLocked && performance.now() - lastScroll > 150) {
        isLocked = false;
        node!.style.pointerEvents = '';
      }
    }

    window.addEventListener('scroll', handleScroll);
    const interval = window.setInterval(updateLock, 60);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearInterval(interval);
      node.style.pointerEvents = '';
    };
  }, [ref]);
}

function ExamplePanel({
  children,
  noPadding,
  noShadow,
  height,
  contentMarginTop,
}: ExamplePanelProps) {
  return (
    <div
      className={cn(
        'max-w-3xl rounded-2xl mx-auto text-secondary leading-normal bg-white dark:bg-gray-950 overflow-hidden w-full overflow-y-auto',
        noShadow ? 'shadow-none' : 'shadow-nav dark:shadow-nav-dark'
      )}
      style={{height}}>
      <div
        className={noPadding ? 'p-0' : 'p-4'}
        style={{contentVisibility: 'auto', marginTop: contentMarginTop}}>
        {children}
      </div>
    </div>
  );
}

function Code({children}: BasicProps) {
  return (
    <code
      dir="ltr"
      className="font-mono inline rounded-lg bg-gray-15/40 dark:bg-secondary-button-dark py-0.5 px-1 text-left">
      {children}
    </code>
  );
}
