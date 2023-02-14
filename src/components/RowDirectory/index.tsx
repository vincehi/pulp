import { deleteDirectories } from "@/services/directories";
import { type Directory } from "@prisma/client";
import { type Component } from "solid-js";

const RowDirectory: Component<{
  directory: Directory;
}> = (props) => {
  const selectedDirectory = (): void => {
    console.log("selectedDir");
  };

  return (
    <div>
      <button onClick={selectedDirectory}>{props.directory.name}</button>
      <button
        onClick={() => {
          void (async () => {
            await deleteDirectories([props.directory.path]);
          })();
        }}
      >
        X
      </button>
    </div>
  );
};

export default RowDirectory;
