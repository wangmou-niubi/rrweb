import type { eventWithTime } from '@rrweb/types';
import type { Replayer, playerConfig } from '@rrweb/replay';
import type { Mirror } from 'rrweb-snapshot';

/**
 * Represents a key time point marker on the progress bar.
 */
export type KeyPointMarker = {
  /**
   * The timestamp of this key point (in milliseconds, absolute timestamp matching event timestamps).
   */
  timestamp: number;
  /**
   * The type/category of this marker (e.g. 'console-error', 'network-error').
   * Used for grouping and styling.
   */
  type: string;
  /**
   * Optional color for the marker bar. If not provided, falls back to
   * the color defined in `keyPointStyles[type].color`, or a default red.
   */
  color?: string;
  /**
   * Optional icon URL or SVG string to display above the marker.
   */
  icon?: string;
  /**
   * Optional tooltip text shown on hover.
   */
  tooltip?: string;
  /**
   * Optional arbitrary data passed back in the click callback.
   */
  data?: unknown;
};

/**
 * Selected time range (timestamps in ms, same as event timestamps).
 */
export type TimeRange = {
  startTime: number;
  endTime: number;
};

/**
 * Style configuration for a key point type.
 */
export type KeyPointStyle = {
  /**
   * Default color for markers of this type.
   */
  color?: string;
  /**
   * Optional icon URL or SVG string for markers of this type.
   */
  icon?: string;
};

export type RRwebPlayerOptions = {
  target: HTMLElement;
  props: {
    /**
     * The events to replay.
     * @default `[]`
     */
    events: eventWithTime[];
    /**
     * The width of the replayer
     * @defaultValue `1024`
     */
    width?: number;
    /**
     * The height of the replayer
     * @defaultValue `576`
     */
    height?: number;
    /**
     * The maximum scale of the replayer (1 = 100%). Set to 0 for unlimited
     * @defaultValue `1`
     */
    maxScale?: number;
    /**
     * Whether to autoplay
     * @defaultValue `true`
     */
    autoPlay?: boolean;
    /**
     * The default speed to play at
     * @defaultValue `1`
     */
    speed?: number;
    /**
     * Speed options in UI
     * @defaultValue `[1, 2, 4, 8]`
     */
    speedOption?: number[];
    /**
     * Whether to show the controller UI
     * @defaultValue `true`
     */
    showController?: boolean;
    /**
     * Customize the custom events style with a key-value map
     * @defaultValue `{}`
     */
    tags?: Record<string, string>;
    /**
     * Customize the color of inactive periods indicator in the progress bar with a valid CSS color string.
     * @defaultValue `#D4D4D4`
     */
    inactiveColor?: string;
    /**
     * The start timestamp to display on the timeline (in milliseconds)
     * If not provided, will use the first event timestamp
     * @defaultValue `undefined`
     */
    startTime?: number;
    /**
     * The end timestamp to display on the timeline (in milliseconds)
     * If not provided, will use the last event timestamp
     * @defaultValue `undefined`
     */
    endTime?: number;
    /**
     * Key time point markers to display on the progress bar.
     * Each marker represents a notable moment (e.g. console error, network failure).
     * @defaultValue `[]`
     */
    keyPoints?: KeyPointMarker[];
    /**
     * Style configuration per key point type.
     * Keys are marker type strings, values define default color and icon.
     * @defaultValue `{}`
     */
    keyPointStyles?: Record<string, KeyPointStyle>;
    /**
     * Callback when a key point marker is clicked.
     * Receives the marker data and its timestamp.
     */
    onKeyPointClick?: (marker: KeyPointMarker) => void;
    /**
     * Whether to show the time range selector on the progress bar.
     * @defaultValue `true`
     */
    showTimeRangeSelector?: boolean;
    /**
     * Initial time range (timestamps in ms). If provided, the range selector will show this range.
     */
    timeRange?: TimeRange;
    /**
     * Callback when the user changes the selected time range by dragging on the progress bar.
     * Receives { startTime, endTime } in milliseconds (timestamps).
     */
    onTimeRangeChange?: (range: TimeRange) => void;
  } & Partial<playerConfig>;
};

export type RRwebPlayerExpose = {
  addEventListener: (
    event: string,
    handler: (params: unknown) => unknown,
  ) => void;
  addEvent: (event: eventWithTime) => void;
  getMetaData: Replayer['getMetaData'];
  getReplayer: () => Replayer;
  getMirror: () => Mirror;
  // getSilly: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
  toggleSkipInactive: () => void;
  toggleFullscreen: () => void;
  triggerResize: () => void;
  $set: (options: { width: number; height: number }) => void;
  play: () => void;
  pause: () => void;
  goto: (timeOffset: number, play?: boolean) => void;
  playRange: (
    timeOffset: number,
    endTimeOffset: number,
    startLooping?: boolean,
    afterHook?: undefined | (() => void),
  ) => void;
};
