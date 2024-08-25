import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import { uniq } from "lodash";
import * as mqtt from "mqtt";
import { request } from "graphql-request";
import { Scene } from "../types/Scene";

import query from "./query";

interface ControlState {
  uuid: string;
  users: string[];
  shows: any[];
  show: any;
  startTime: Date | null;
  previewScene: any;
  playerScene: any;
  init: () => void;
  publish: (uuid: string) => void;
  addUser: (user: any) => void;
  startShow: (show: any) => void;
  setPreviewScene: (scene: Scene) => void;
  setPlayerScene: (scene: Scene) => void;
  setPreviousScene: () => void;
  setNextScene: () => void;
}

const useStore = create<ControlState>()(
  devtools(
    (set, get) => ({
      uuid: v4(),
      users: [],
      shows: [],
      show: null,
      startTime: null,
      previewScene: null,
      playerScene: null,
      init: () => {
        request(`${import.meta.env.VITE_CMS_BASEURL}/graphql`, query).then(
          (response: any) => {
            set({ shows: response?.shows });
          }
        );
      },
      publish: (uuid) => {
        // Implement the publish function if needed
      },
      addUser: (user) => {
        const users = uniq([...get().users, user.uuid]);
        set({ users });
      },
      startShow: (show: any) => {
        set({ show, startTime: new Date() });
      },
      setPreviewScene: (scene: any) => {
        set({ previewScene: scene });
      },
      setPlayerScene: (scene: any) => {
        const { show } = get();
        if (!show) {
          return;
        }
        set({ playerScene: scene });
      },
      setPreviousScene: () => {
        const { show, playerScene } = get();
        if (!show || !show.scenes || !playerScene) return;

        const currentIndex = show.scenes
          .map((scene: any) => scene.scenes_id)
          .findIndex((scene: any) => scene.id === playerScene.id);

        if (currentIndex > 0) {
          const previousScene = show.scenes[currentIndex - 1];
          set({ playerScene: previousScene?.scenes_id });
        }
      },
      setNextScene: () => {
        const { show, playerScene } = get();
        if (!show || !show.scenes || !playerScene) return;

        const currentIndex = show.scenes
          .map((scene: any) => scene.scenes_id)
          .findIndex((scene: any) => scene.id === playerScene.id);

        if (currentIndex < show.scenes.length - 1) {
          const nextScene = show.scenes[currentIndex + 1];
          set({ playerScene: nextScene?.scenes_id });
        }
      },
    }),
    { name: "control" }
  )
);

export default useStore;
