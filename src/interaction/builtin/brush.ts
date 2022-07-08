import { BrushInteraction } from '../../spec';
import { createInteraction } from '../create';

export type BrushOptions = Omit<BrushInteraction, 'type'>;

export const ToggleBrushing = (options) => {
  const { brushing } = options;
  return (context) => {
    const { shared } = context;
    shared.brushing = brushing;
    return context;
  };
};

export const RecordBrushAreas = (options) => {
  const { starting, clear } = options;
  return (context) => {
    const { shared, selection, event } = context;

    const plot = selection.select('.plot').node();
    const [x0, y0] = plot.getBounds().min;
    const { offsetX, offsetY } = event;

    if (clear) {
      shared.areas = [];
    } else {
      const { areas = [] } = shared;
      const newAreas = [...areas];
      const range = newAreas.splice(-1, starting ? 0 : 1)[0] || [];
      const currentPoint = [offsetX - x0, offsetY - y0];

      if (starting) {
        range[0] = currentPoint;
      } else {
        range[1] = currentPoint;
      }

      newAreas.push(range);
      shared.areas = newAreas;
    }

    return context;
  };
};

/**
 * @todo filterBy `x` and `y`, now is only compare `x`
 */
const FilterRange = (options) => {
  const { reset } = options;
  return (context) => {
    const { shared, scale, options: plotOptions } = context;

    const { selectedElements } = shared;

    if (!shared.originTransform) {
      shared.originTransform = plotOptions.marks[0].transform || [];
    }

    const { x: scaleX } = scale;
    // console.log('range options', scale.x.getOptions().domain);
    const isBandScale = !!scaleX.getBandWidth;

    // todo 使用其它方式，获取原始 x 值
    const data = selectedElements.map((element) => element.__data__.title);
    const min = Math.min.apply(null, data);
    const max = Math.max.apply(null, data);

    const getUpdatedOptions = () => {
      if (reset) {
        plotOptions.marks[0].transform = shared.originTransform;
      } else if (data.length > 0) {
        const transform = [...shared.originTransform];
        const { field: xField } = scaleX.getOptions();
        transform.push({
          type: 'filterBy',
          fields: [xField],
          callback: (x) =>
            isBandScale ? data.includes(x) : x >= min && x <= max,
        });

        plotOptions.marks[0].transform = transform;
      }

      return plotOptions;
    };

    shared.updatedOptions = getUpdatedOptions();

    return context;
  };
};

export const InteractionDescriptor = (options?: BrushOptions) => ({
  start: [
    {
      trigger: 'plot:pointerenter',
      action: [{ type: 'cursor', cursor: 'crosshair' }],
    },
    {
      trigger: 'plot:pointerdown',
      action: [
        { type: RecordBrushAreas, clear: true },
        { type: RecordBrushAreas, starting: true },
        { type: ToggleBrushing, brushing: true },
      ],
    },
    {
      trigger: 'plot:pointermove',
      isEnable: (context) => context.shared.brushing,
      action: [
        { type: RecordBrushAreas },
        { type: 'mask', maskType: options?.maskType },
      ],
    },
    // {
    //   trigger: 'plot:maskChange',
    //   action: [
    //     { type: 'elementSelection', from: 'mask' },
    //     { type: 'highlightElement' },
    //   ],
    // },
    {
      trigger: 'plot:pointerup',
      action: [
        { type: ToggleBrushing, brushing: false },
        { type: 'elementSelection', from: 'mask' },
        { type: FilterRange },
        { type: 'plot' },
        // The same as mask:hide
        { type: RecordBrushAreas, clear: true },
        { type: 'mask' },
        // { type: 'elementSelection', from: 'mask' },
        // { type: 'highlightElement' },
      ],
    },
  ],
  end: [
    {
      trigger: 'plot:pointerleave',
      action: [{ type: 'cursor', cursor: 'default' }],
    },
    {
      trigger: 'plot:click',
      isEnable: (context) => context.event.detail === 2,
      action: [{ type: FilterRange, reset: true }],
    },
  ],
});

export const Brush = createInteraction<BrushOptions>(InteractionDescriptor);

Brush.props = {};
