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
  scenes: Scene[];
  index: number;
  responses: any;
  previewScene: any;
  playerScene: any;
  init: () => void;
  //   increase: (by: number) => void;
  publish: (uuid: string) => void;
  addUser: (user: any) => void;
  addResponse: (response: any) => void;
  setIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
  deleteQuestion: (uuid: string) => void;
  import: () => void;
  export: () => void;
  addQuestion: (question: Scene) => void;
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
      scenes: [
        {
          uuid: v4(),
          type: "YES_NO",
          text: "this is the text",
          labelYes: "yay",
          labelNo: "nay",
        },
        {
          uuid: v4(),
          type: "YES_NO",
          text: "this is the text 2",
          labelYes: "yes",
          labelNo: "no",
        },
        {
          uuid: v4(),
          type: "RATING",
          text: "this is a rating question",
          labelMax: "fully agree",
          labelMin: "fully disagree",
        },
        {
          uuid: v4(),
          type: "TEXT",
          img: "https://cataas.com/cat/says/test",
          text: "name one adjective that describes the image!",
          wordCount: 1,
        },
        {
          uuid: v4(),
          type: "MULTIPLE_CHOICE",
          img: "https://cataas.com/cat/says/test",
          text: "which option fits best.",
          options: ["hot", "boring", "cute", "decent"],
          numberOfSelections: 1,
        },
        {
          uuid: v4(),
          type: "MULTIPLE_CHOICE",
          img: "https://cataas.com/cat/says/test",
          text: "which option fits best.",
          options: ["hot", "boring", "cute", "decent"],
          numberOfSelections: 2,
        },
      ],
      index: 0,
      init: () => {
        request("http://localhost:8055/graphql", query).then(
          (response: any) => {
            console.log(response);
            set({ shows: response?.shows });
          }
        );
      },
      responses: {},
      previewScene: null,
      playerScene: null,
      publish: (uuid) => {
        const question = get().scenes.find((q) => q.uuid === uuid);
        // const payload: QuestionYesNo =
        if (question) {
          client.publish("inau/question", JSON.stringify(question));
        }
      },
      addUser: (user) => {
        const users = uniq([...get().users, user.uuid]);
        set({ users });
      },
      addResponse: (response) => {
        console.log(response);
        const responses = { ...get().responses };
        responses[response.question] = [
          ...(responses[response.question] ?? []),
          response,
        ];
        set({ responses });
      },
      next: () => {
        const index = get().index + 1;
        if (index < get().scenes.length) {
          set({ index });
          get().publish(get().scenes[index].uuid);
        }
      },
      previous: () => {
        const index = get().index - 1;
        if (index >= 0) {
          set({ index });
          get().publish(get().scenes[index].uuid);
        }
      },
      deleteQuestion(uuid) {
        const questions = get().scenes.filter((q) => q.uuid !== uuid);
        set({ scenes: questions });
      },
      import: () => {
        // Create an invisible input element
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = ".json";
        inputElement.style.display = "none";

        // Append the input element to the body
        document.body.appendChild(inputElement);

        // Function to handle file selection and reading
        function handleFileUpload(event: any) {
          const file = event.target.files[0];

          if (!file) {
            console.log("No file selected.");
            return;
          }

          const reader = new FileReader();

          reader.onload = function (event: any) {
            if (event) {
              const jsonContent = event.target.result;
              try {
                const jsonData = JSON.parse(jsonContent);
                // Do whatever you want with the jsonData here
                set({ scenes: jsonData });
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          };

          reader.readAsText(file);
        }

        // Add event listener to the input element
        inputElement.addEventListener("change", handleFileUpload);

        // Trigger the file input dialog
        inputElement.click();
      },
      export: () => {
        const content = JSON.stringify(get().scenes);
        const fileName = "export.json";
        const contentType = "text/plain";
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      },
      setIndex: (index) => {
        set({ index });
        get().publish(get().scenes[index].uuid);
      },
      addQuestion: (question) => {
        set({ scenes: [...get().scenes, question] });
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
