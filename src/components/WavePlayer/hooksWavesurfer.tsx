import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import WaveSurfer, {
  type WaveSurferEvents,
  type WaveSurferOptions,
} from "wavesurfer.js";

type WavesurferEventHandler<T extends unknown[]> = (
  wavesurfer: WaveSurfer,
  ...args: T
) => void;

type OnWavesurferEvents = {
  [K in keyof WaveSurferEvents as `on${Capitalize<K>}`]?: WavesurferEventHandler<
    WaveSurferEvents[K]
  >;
};

type PartialWavesurferOptions = Omit<WaveSurferOptions, "container">;

/**
 * Props for the Wavesurfer component
 * @public
 */
export type WavesurferProps = PartialWavesurferOptions & OnWavesurferEvents;

function createWavesurferInstance(
  container: HTMLDivElement,
  options: Partial<WaveShaperOptions>
) {
  const [wavesurfer, setWavesurfer] = createSignal<WaveSurfer | null>(null);

  createEffect(() => {
    if (!container) return;

    const ws = WaveSurfer.create({
      ...options,
      container,
    });

    setWavesurfer(ws);

    onCleanup(() => {
      ws.destroy();
    });
  });

  return wavesurfer;
}

function createWavesurferState(wavesurfer: () => WaveSurfer | null) {
  const [isReady, setIsReady] = createSignal(false);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);

  createEffect(() => {
    const ws = wavesurfer();
    if (!ws) return;

    const unsubscribeFns = [
      ws.on("load", () => {
        setIsReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
      }),
      ws.on("ready", () => {
        setIsReady(true);
        setIsPlaying(false);
        setCurrentTime(0);
      }),
      ws.on("play", () => setIsPlaying(true)),
      ws.on("pause", () => setIsPlaying(false)),
      ws.on("timeupdate", () => setCurrentTime(ws.getCurrentTime())),
      ws.on("destroy", () => {
        setIsReady(false);
        setIsPlaying(false);
      }),
    ];

    onCleanup(() => {
      unsubscribeFns.forEach((fn) => fn());
    });
  });

  return { isReady, isPlaying, currentTime };
}

const EVENT_PROP_RE = /^on([A-Z])/;
const isEventProp = (key: string) => EVENT_PROP_RE.test(key);
const getEventName = (key: string) =>
  key.replace(EVENT_PROP_RE, (_, $1) =>
    $1.toLowerCase()
  ) as keyof WaveSurferEvents;

function createWavesurferProps(props) {
  const test = createMemo(() => {
    const options: PartialWavesurferOptions = {};
    const events: OnWavesurferEvents = {};

    for (const key in props) {
      if (isEventProp(key)) {
        events[key as keyof OnWavesurferEvents] =
          props[key as keyof WavesurferProps];
      } else {
        options[key as keyof PartialWavesurferOptions] =
          props[key as keyof WavesurferProps];
      }
    }

    console.log(options);
    console.log(events);
    return [options, events] as [PartialWavesurferOptions, OnWavesurferEvents];
  });
  console.log(test());
  return test();
}

function createWavesurferEvents(
  wavesurfer: () => WaveSurfer | null,
  events: () => OnWavesurferEvents
) {
  createEffect(() => {
    const ws = wavesurfer();
    if (!ws) return;

    const currentEvents = events();
    const eventEntries = Object.entries(currentEvents);
    if (!eventEntries.length) return;

    const unsubscribeFns = eventEntries.map(([name, handler]) => {
      const event = getEventName(name);
      return ws.on(event, (...args) =>
        (handler as WavesurferEventHandler<WaveSurferEvents[typeof event]>)(
          ws,
          ...args
        )
      );
    });

    onCleanup(() => {
      unsubscribeFns.forEach((fn) => fn());
    });
  });
}

export const WavesurferPlayer = (props: WavesurferProps) => {
  let containerRef: HTMLDivElement | undefined, wavesurfer;

  // const [options, events] = bags();
  onMount(() => {
    const [options, events] = createWavesurferProps(props);
    wavesurfer = createWavesurferInstance(containerRef, options);
    createWavesurferEvents(wavesurfer, () => events);
  });

  return <div ref={containerRef} />;
};
