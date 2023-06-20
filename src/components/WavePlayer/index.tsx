import { type Component, createEffect, onMount } from "solid-js";
import WaveSurfer from "wavesurfer.js";
import { useSearch } from "@/providers/SearchProvider";
import { convertFileSrc } from "@tauri-apps/api/tauri";
// import styles from "./App.module.css";

// https://dolby.io/blog/how-to-visualize-and-annotate-your-audio-with-wavesurfer-js-and-konva-in-solidjs/
const WavePlayer: Component = () => {
  const [store, actions] = useSearch();
  let container!: HTMLDivElement, // Auto-referenced by the returning JSX
    wavesurfer: WaveSurfer;

  onMount(() => {
    wavesurfer = WaveSurfer.create({
      container,
      waveColor: "violet",
      progressColor: "purple",
      responsive: true,
      interact: false,
    });
  });

  createEffect(() => {
    const file = store.pathSelected;
    if (file !== "") {
      wavesurfer.load(convertFileSrc(file));
      wavesurfer.on("ready", function () {
        if (store.autoPlay) {
          void wavesurfer.play();
        }
      });
    }
  }, [store.autoPlay]);

  const play = (): void => {
    void wavesurfer.playPause();
  };

  return (
    <>
      <div>
        <div class="flex items-center mb-4">
          <input
            id="default-checkbox"
            type="checkbox"
            checked={store.autoPlay}
            onChange={actions.toggleAutoPlay}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="default-checkbox"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Auto play
          </label>
        </div>
      </div>
      <div ref={container}></div>
      <button
        onClick={play}
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        play/pause
      </button>
    </>
  );
};
export default WavePlayer;
