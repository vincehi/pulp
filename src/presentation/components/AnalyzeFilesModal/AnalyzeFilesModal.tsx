import { analyzeDirectoryFilesStore } from "@/presentation/components/AnalyzeFilesModal/store";
import { onMount, type Component } from "solid-js";

const AnalyzeFilesModal: Component = () => {
  const [store, actions] = analyzeDirectoryFilesStore;

  onMount(() => {
    void (async () => {
      await actions.initEvent();
    })();
  });

  return (
    <>
      <input
        type="checkbox"
        id="my_modal_6"
        class="modal-toggle"
        checked={store.processing}
      />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">File analysis</h3>
          <div class="py-4 flex items-center">
            <span class="loading loading-ring loading-xs shrink-0 mr-2" />
            {store.file}
          </div>
          <small class="py-4">Please be patient, this may take some time</small>

          <div class="modal-action">
            <form method="dialog" onSubmit={actions.stopAnalyzeDirectoryFiles}>
              <button class="btn">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyzeFilesModal;
