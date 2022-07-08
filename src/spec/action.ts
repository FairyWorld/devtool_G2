import { ActionComponent } from '../interaction';
import { FisheyeCoordinate } from './coordinate';

export type Action =
  | FisheyeFocusAction
  | CustomAction
  | SurfacePointSelectionAction
  | ActiveElementAction
  | HighlightElementAction
  | TriggerInfoSelectionAction
  | LegendItemSelectionAction
  | SetItemStateAction
  | PlotAction
  | CursorAction
  | TooltipAction
  | MaskAction;

export type ActionTypes =
  | 'fisheyeFocus'
  | 'surfacePointSelection'
  | 'elementSelection'
  | 'activeElement'
  | 'highlightElement'
  | 'triggerInfoSelection'
  | 'legendItemSelection'
  | 'setItemState'
  | 'plot'
  | 'cursor'
  | 'tooltip'
  | 'mask'
  | CustomAction;

export type FisheyeFocusAction = {
  type?: 'fisheyeFocus';
} & Omit<FisheyeCoordinate, 'type'>;

export type SurfacePointSelectionAction = {
  type?: 'surfacePointSelection';
  trigger?: 'item' | 'axis';
};

export type ActiveElementAction = {
  type?: 'activeElement';
  color?: string;
};

export type HighlightElementAction = {
  type?: 'highlightElement';
  color?: string;
};

export type CursorAction = {
  type?: 'cursor';
  cursor?: string;
};

export type PlotAction = {
  type?: 'plot';
};

export type TooltipAction = {
  type?: 'tooltip';
  showMarkers?: boolean;
  showCrosshairs?: boolean;
  crosshairs?: any;
  markers?: any;
};

export type MaskAction = {
  type?: 'mask';
  maskType?: 'polygon' | 'rect' | 'rectX' | 'rectY';
};

export type ElementSelectionAction = {
  type?: 'elementSelection';
  from?: string;
  filterBy?: 'x' | 'color';
};

export type TriggerInfoSelectionAction = {
  type?: 'triggerInfoSelection';
  multiple?: boolean;
};

export type LegendItemSelectionAction = {
  type?: 'legendItemSelection';
  from?: 'selectedElements' | 'triggerInfo';
};

export type SetItemStateAction = {
  type?: 'setItemState';
  color?: string;
  items?: string[];
  state?: string;
};

export type CustomAction = {
  type?: ActionComponent;
  [key: string]: any;
};
