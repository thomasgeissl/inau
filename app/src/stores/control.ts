import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import { uniq } from "lodash";
import * as mqtt from "mqtt";
import { request } from "graphql-request";
import { Scene } from "../types/Scene";

import query from "./graphql/query";
import programSubscriptionQuery from "./graphql/programSubscription";
import sceneSubscriptionQuery from "./graphql/sceneSubscription";
import NoSleep from "@uriopass/nosleep.js";
import { createClient } from "graphql-ws";

const client = mqtt.connect(import.meta.env.VITE_BROKER_URL);
const noSleep = new NoSleep();

const graphqlSubscriptionClient = createClient({
  url: import.meta.env.VITE_CMS_GRAPHQL_WS_URL,
  keepAlive: 30000,
  connectionParams: async () => {
    return { access_token: import.meta.env.VITE_CMS_ACCESS_TOKEN };
  },
});

graphqlSubscriptionClient.subscribe(
  {
    query: programSubscriptionQuery,
  },
  {
    next: ({ data }: any) => {
      if (data?.shows_mutated?.event == "update") {
        useStore.getState().updateShow(data?.shows_mutated?.data);
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  }
);

graphqlSubscriptionClient.subscribe(
  {
    query: sceneSubscriptionQuery,
  },
  {
    next: ({ data }: any) => {
      if (data?.scenes_mutated?.event == "update") {
        useStore.getState().updateScene(data?.scenes_mutated?.data);
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  }
);

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
  updateShow: (show: any) => void;
  updateScene: (scene: any) => void;
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
      updateShow: (updatedShow: any) => {
        const { shows, show } = get();

        // Find the index of the show to update
        const index = shows.findIndex((show) => show.id === updatedShow.id);

        if (index !== -1) {
          // Replace the old show with the updated one
          const updatedShows = [
            ...shows.slice(0, index),
            updatedShow,
            ...shows.slice(index + 1),
          ];

          // Update the state with the new shows array
          set({
            shows: updatedShows,
            show: show?.id === updatedShow?.id ? updatedShow : show,
          });
        }
      },
      updateScene: (updatedScene: any) => {
        const { shows, show, previewScene } = get();

        // Update the scene in the `shows` array
        const updatedShows = shows.map((s) => {
          if (s.id === show?.id) {
            const updatedScenes = s.scenes.map((scene: any) =>
              scene.scenes_id.id === updatedScene.id
                ? { ...scene, scenes_id: updatedScene }
                : scene
            );
            return { ...s, scenes: updatedScenes };
          }
          return s;
        });

        // Update the scene in the `show`
        const updatedShowScenes = show
          ? show.scenes.map((scene: any) =>
              scene.scenes_id.id === updatedScene.id
                ? { ...scene, scenes_id: updatedScene }
                : scene
            )
          : [];

        const updatedShow = show
          ? { ...show, scenes: updatedShowScenes }
          : null;

        // Update the `previewScene` if its ID matches the updated scene's ID
        const updatedPreviewScene =
          previewScene?.id === updatedScene.id ? updatedScene : previewScene;

        // Update the state with the new data
        set({
          shows: updatedShows,
          show: updatedShow,
          previewScene: updatedPreviewScene,
        });
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
        client.publish(`inau/${show?.id ?? "demo"}/scene`, JSON.stringify(scene));
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
