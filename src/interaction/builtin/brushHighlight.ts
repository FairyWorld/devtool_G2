import { BrushHighlightInteraction } from '../../spec';
import { createInteraction } from '../create';
import { RecordBrushAreas, ToggleBrushing } from './brush';

export type BrushHighlightOptions = Omit<BrushHighlightInteraction, 'type'>;

export const InteractionDescriptor = (options?: BrushHighlightOptions) => ({
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
    {
      trigger: 'plot:maskChange',
      action: [
        { type: 'elementSelection', from: 'mask' },
        { type: 'highlightElement' },
      ],
    },
    {
      trigger: 'plot:pointerup',
      action: [{ type: ToggleBrushing, brushing: false }],
    },
  ],
  end: [
    {
      trigger: 'plot:pointerleave',
      action: [{ type: 'cursor', cursor: 'default' }],
    },
    {
      // fix-G pointerdown do not trigger dblclick, event.detail is undefined.
      trigger: 'plot:click',
      // dblclick. https://g-next.antv.vision/zh/docs/api/event
      isEnable: (context) => context.event.detail === 2,
      action: [
        { type: RecordBrushAreas, clear: true },
        { type: 'mask' },
        { type: 'elementSelection', from: 'mask' },
        { type: 'highlightElement' },
      ],
    },
  ],
});

export const BrushHighlight = createInteraction<BrushHighlightOptions>(
  InteractionDescriptor,
);

BrushHighlight.props = {};
