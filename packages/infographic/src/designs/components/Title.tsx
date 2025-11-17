/** @jsxImportSource @antv/infographic-jsx */
import {
  Text,
  type BaseGeometryProps,
  type TextProps,
} from '@antv/infographic-jsx';
import type { ThemeColors } from '../../themes';
import { FlexLayout } from '../layouts';

export interface TitleProps extends BaseGeometryProps {
  alignHorizontal?: 'left' | 'center' | 'right';
  title?: string;
  desc?: string;
  descLineNumber?: number;

  themeColors: ThemeColors;
}

export const Title = (props: TitleProps) => {
  const {
    x = 0,
    y = 0,
    width = 720,
    alignHorizontal = 'center',
    title,
    desc,
    descLineNumber: subTitleLineNumber = 2,
    themeColors,
  } = props;
  const MainTitle = (props: TextProps) => {
    const defaultProps: TextProps = {
      fontSize: 24,
      fill: themeColors.colorPrimaryText,
      width,
      height: desc ? 32 : 64,
      lineHeight: 1.4,
      alignHorizontal,
    };
    return (
      <Text {...defaultProps} {...props} data-element-type="title">
        {title}
      </Text>
    );
  };

  const Desc = (props: TextProps) => {
    const defaultProps: TextProps = {
      fontSize: 16,
      fill: themeColors.colorTextSecondary,
      width,
      alignHorizontal,
      lineHeight: 1.4,
      height: subTitleLineNumber * 24,
    };
    return (
      <Text {...defaultProps} {...props} data-element-type="desc">
        {desc}
      </Text>
    );
  };

  return (
    <FlexLayout flexDirection="column" x={x} y={y} width={width} gap={8}>
      {title && <MainTitle />}
      {desc && <Desc />}
    </FlexLayout>
  );
};
