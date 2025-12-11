import { Text, type BaseGeometryProps, type TextProps } from '../../jsx';
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

  if (!title && !desc) return null;

  return (
    <FlexLayout
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      x={x}
      y={y}
      gap={8}
    >
      {title && <MainTitle />}
      {desc && <Desc />}
    </FlexLayout>
  );
};
