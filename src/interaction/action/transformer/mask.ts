import { Rect, CustomEvent } from '@antv/g';
import { Vector2 } from '@antv/coord';
import { ActionComponent as AC } from '../../types';
import { MaskAction } from '../../../spec';

export type MaskOptions = Omit<MaskAction, 'type'>;

function getMaskBounds(
  range: [Vector2, Vector2],
  maskType: string,
  plotHalfExtents: any,
) {
  const [[startX, startY], [endX, endY]] = range;
  let x = Math.min(startX, endX);
  let y = Math.min(startY, endY);
  let width = Math.abs(endX - startX);
  let height = Math.abs(endY - startY);
  if (maskType === 'rectY') {
    x = 0;
    width = plotHalfExtents[0] * 2;
  }
  if (maskType === 'rectX') {
    y = 0;
    height = plotHalfExtents[1] * 2;
  }
  return { x, y, width, height };
}

/**
 * @todo add Polygon mask
 * @todo add mask resize handler
 */
export const Mask: AC<MaskOptions> = (options) => {
  const { maskType } = options;
  return (context) => {
    const { shared, selection, transientLayer } = context;

    const { areas = [] } = shared;
    // Find the first of main layers.
    const plot = selection.select('.plot').node();
    const halfExtents = plot.getBounds().halfExtents;

    // @todo 需要注意是否存在非法的 area range
    const data = areas.map((range, index) => {
      const { x, y, width, height } = getMaskBounds(
        range,
        maskType,
        halfExtents,
      );
      return {
        maskIndex: index,
        x,
        y,
        width,
        height,
        fill: '#000',
        fillOpacity: 0.15,
      };
    });

    transientLayer
      .selectAll('.mask')
      .data(data, (d) => d.maskIndex)
      .join(
        (enter) =>
          enter.append((style) => new Rect({ className: 'mask', style })),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
            this.dispatchEvent(new CustomEvent('maskChange'));
          }),
        (exit) => exit.remove(),
      );

    return context;
  };
};

Mask.props = {};
