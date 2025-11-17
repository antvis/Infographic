/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Rect } from '@antv/infographic-jsx';

export interface BtnProps extends RectProps {
  indexes: number[];
}

export const BtnAdd = (props: BtnProps) => {
  const { indexes, ...restProps } = props;
  const defaultProps: RectProps = {
    fill: '#B9EBCA',
    fillOpacity: 0.3,
    width: 20,
    height: 20,
    'data-indexes': indexes,
    'data-element-type': 'btn-add',
  };
  return <Rect {...defaultProps} {...restProps} />;
};

export const BtnRemove = (props: BtnProps) => {
  const { indexes, ...restProps } = props;
  const defaultProps: RectProps = {
    fill: '#F9C0C0',
    fillOpacity: 0.3,
    width: 20,
    height: 20,
    'data-indexes': indexes,
    'data-element-type': 'btn-remove',
  };
  return <Rect {...defaultProps} {...restProps} />;
};
