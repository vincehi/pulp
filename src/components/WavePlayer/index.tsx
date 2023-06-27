import {
  type Component,
  createEffect,
  createSignal,
  Match,
  onMount,
  Switch,
} from "solid-js";
import WaveSurfer from "wavesurfer.js";
import { useSearch } from "@/providers/SearchProvider";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { pause, play } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { useLocalStorage } from "solidjs-use";
// import styles from "./App.module.css";

// https://dolby.io/blog/how-to-visualize-and-annotate-your-audio-with-wavesurfer-js-and-konva-in-solidjs/
const WavePlayer: Component = () => {
  const [store] = useSearch();
  let container!: HTMLDivElement, // Auto-referenced by the returning JSX
    wavesurfer: WaveSurfer;

  const [isPlaying, setIsPlaying] = createSignal(false);

  const [autoPlay, setAutoplay] = useLocalStorage("autoPlay", false);

  onMount(() => {
    wavesurfer = WaveSurfer.create({
      container,
      waveColor: "violet",
      progressColor: "purple",
      interact: false,
    });
    wavesurfer.on("ready", function () {
      console.log("One init");
      if (autoPlay()) {
        void wavesurfer.play();
      }
    });
    wavesurfer.on("play", () => {
      setIsPlaying(true);
    });
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("finish", () => setIsPlaying(false));
  });

  createEffect(() => {
    const file = store.pathSelected;
    if (file !== "") {
      wavesurfer.load(convertFileSrc(file));
    }
  }, []);

  const handlePlayPause = (event: Event): void => {
    event.preventDefault();
    void wavesurfer.playPause();
  };

  return (
    <div class="player p-4">
      <div>
        <div class="flex items-center mb-4">
          <input
            id="default-checkbox"
            type="checkbox"
            checked={autoPlay()}
            onChange={() => setAutoplay((prev) => prev === false)}
            class="checkbox checkbox-sm"
          />
          <label
            for="default-checkbox"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Auto play
          </label>
        </div>
      </div>
      <div ref={container} />

      <label class="swap">
        <Switch>
          <Match when={isPlaying()}>
            <input type="checkbox" checked={true} onClick={handlePlayPause} />
          </Match>
          <Match when={!isPlaying()}>
            <input type="checkbox" checked={false} onClick={handlePlayPause} />
          </Match>
        </Switch>
        <Icon
          path={play}
          class="swap-off flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        />
        <Icon
          path={pause}
          class="swap-on flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        />
      </label>
    </div>
  );
};
export default WavePlayer;
