import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import * as mqtt from "mqtt";
import { request } from "graphql-request";
import { createClient } from "graphql-ws";

import query from "./graphql/query";
import showSubscriptionQuery from "./graphql/showSubscription";
import sceneSubscriptionQuery from "./graphql/sceneSubscription";
import { Scene } from "../types/Scene";
import { User } from "../types/User";
import responsesSubscriptionQuery from "./graphql/responsesSubscription";
import usersSubscriptionQuery from "./graphql/usersSubscription";

let inited = false;

const graphqlSubscriptionClient = createClient({
  url: import.meta.env.VITE_CMS_GRAPHQL_WS_URL,
  keepAlive: 30000,
  connectionParams: async () => {
    return { access_token: import.meta.env.VITE_CMS_ACCESS_TOKEN };
  },
});

graphqlSubscriptionClient.subscribe(
  {
    query: showSubscriptionQuery,
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
graphqlSubscriptionClient.subscribe(
  {
    query: responsesSubscriptionQuery,
  },
  {
    next: ({ data }: any) => {
      if (data?.responses_mutated?.event == "create") {
        useStore.getState().addResponse(data?.responses_mutated?.data);
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  }
)
graphqlSubscriptionClient.subscribe(
  {
    query: usersSubscriptionQuery,
  },
  {
    next: ({ data }: any) => {
      console.log(data)
      if (data?.users_mutated?.event == "update") {
        useStore.getState().addOrUpdateUser(data?.users_mutated?.data);
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  }
)

let client: mqtt.MqttClient;

interface ControlState {
  uuid: string;
  users: any[];
  shows: any[];
  responses: any[];
  show: any;
  startTime: Date | null;
  previewScene: any;
  playerScene: any;
  init: () => void;
  addUser: (user: string, show: string) => void;
  addOrUpdateUser: (user: any)=>void;
  addResponse: (response: any) => void;
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
      responses: [],
      show: null,
      startTime: null,
      previewScene: null,
      playerScene: null,
      init: () => {
        request(`${import.meta.env.VITE_CMS_BASEURL}/graphql`, query).then(
          (response: any) => {
            set({ shows: response?.shows, responses: response.responses, users: response.users});
          }
        );
        if (inited) {
          return;
        }
        inited = true;

        client = mqtt.connect(import.meta.env.VITE_BROKER_URL);

        client.on("connect", () => {
          console.log("Connected to MQTT broker");
          client.subscribe(`inau/+/login`, (err) => {
            if (!err) {
              console.log("Subscription successful");
            } else {
              console.error("Subscription failed", err);
            }
          });
        });

        client.on("message", (topic, message) => {
          console.log(
            `Received message from topic ${topic}: ${message.toString()}`
          );

          const match = topic.match(/^inau\/([^/]+)\/login$/);
          if (match) {
            const id = match[1];
            try {
              // get().addUser(JSON.parse(message.toString()).uuid, id);
              // console.log(`Extracted ID: ${id}`);
            } catch (error) {
              console.log(error);
            }

            // Add further processing with the extracted id and message here
          } else {
            console.log("Topic does not match the expected pattern.");
          }

          // Add further processing here as needed
        });

        // Handle connection errors
        client.on("error", (err) => {
          console.error("Connection error:", err);
        });
      },
      addUser: (user: string, show: string) => {
        // const users = [...get().users]
        // if (users.filter((u) => u.uuid === user).length > 0) {
        //   // update timestamp
        //   return;
        // }
        // users.push({ uuid: user, showId: show, timestamp: new Date() });
        // set({ users });
      },
      addOrUpdateUser: (user: any)=>{
        const users = [...get().users]
        const index = users.findIndex((u) => u.id === user.id);
        if (index!== -1) {
          users[index] = {...users[index],...user };
          set({ users });
        } else {
          users.push(user);
          set({ users });
        }
      },
      addResponse: (response: any) => {
        const responses = [...get().responses]
        responses.push(response)
        console.log(response)
        set({ responses: responses });
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
        client.publish(
          `inau/${show?.id ?? "demo"}/scene`,
          JSON.stringify(scene)
        );
        set({ playerScene: scene });
      },
      setPreviousScene: () => {
        const { show, playerScene, setPlayerScene } = get();
        if (!show || !show.scenes || !playerScene) return;

        const currentIndex = show.scenes
          .map((scene: any) => scene.scenes_id)
          .findIndex((scene: any) => scene.id === playerScene.id);

        if (currentIndex > 0) {
          const previousScene = show.scenes[currentIndex - 1];
          setPlayerScene(previousScene?.scenes_id);
        }
      },
      setNextScene: () => {
        const { show, playerScene, setPlayerScene } = get();
        if (!show || !show.scenes || !playerScene) return;

        const currentIndex = show.scenes
          .map((scene: any) => scene.scenes_id)
          .findIndex((scene: any) => scene.id === playerScene.id);

        if (currentIndex < show.scenes.length - 1) {
          const nextScene = show.scenes[currentIndex + 1];
          setPlayerScene(nextScene?.scenes_id);
        }
      },
    }),
    { name: "control" }
  )
);

export default useStore;
