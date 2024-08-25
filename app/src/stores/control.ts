import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import { uniq } from "lodash";
import * as mqtt from "mqtt";
import { request } from "graphql-request";
import { Scene } from "../types/Scene";

import query from "./query";

const client = mqtt.connect("ws://localhost:9001");

client.on("connect", function () {
  client.subscribe("inau/response", function (err) {
    console.error(err);
  });
  client.subscribe("inau/login", function (err) {
    console.error(err);
  });
});

client.on("message", function (topic, message) {
  console.log(topic, message.toString());
  switch (topic) {
    case "inau/login": {
      useStore.getState().addUser(JSON.parse(message.toString()));
      break;
    }
    case "inau/response": {
      useStore.getState().addResponse(JSON.parse(message.toString()));
      break;
    }
  }
});

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
      init: () => {
        request(`${import.meta.env.VITE_CMS_BASEURL}/graphql`, query).then(
          (response: any) => {
            set({ shows: response?.shows });
          }
        );
      },
      previewScene: null,
      playerScene: null,
      publish: (uuid) => {
        // const question = get().scenes.find((q) => q.uuid === uuid);
        // // const payload: QuestionYesNo =
        // if (question) {
        //   client.publish("inau/question", JSON.stringify(question));
        // }
      },
      addUser: (user) => {
        const users = uniq([...get().users, user.uuid]);
        set({ users });
      },
      startShow: (show: any) => {
        set({ show, startTime: new Date() });
      },
      setPreviewScene: (scene: Scene) => {
        set({ previewScene: scene });
      },
      setPlayerScene: (scene: Scene) => {
        set({ playerScene: scene });
      },
      setPreviousScene: () => {},
      setNextScene: () => {},
    }),
    { name: "control" }
  )
);

export default useStore;
