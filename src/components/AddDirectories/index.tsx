import { Component, createEffect, createSignal, onMount } from "solid-js";
import { open } from "@tauri-apps/api/dialog";
import { isEmpty } from "lodash-es";
import { useAppSelector } from "@/contexts/store";
import { createDirectories } from "@/services/directories";

const AddDirectories: Component = () => {
  const [getSelectedDirectories, setSelectedDirectories] = createSignal([]);

  const openSelectedDirectories = async () => {
    const selected = await open({
      directory: true,
      multiple: true,
    });
    setSelectedDirectories(selected);
  };

  createEffect(() => {
    if (!isEmpty(getSelectedDirectories())) {
      createDirectories(getSelectedDirectories());
      setSelectedDirectories([]);
    }
  });

  return <button onClick={openSelectedDirectories}>Add directory</button>;
};

export default AddDirectories;
