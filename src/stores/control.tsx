import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import { uniq } from "lodash";
import * as mqtt from "mqtt/dist/mqtt";
import { Question, QuestionYesNo } from "../types/Question";

const client = mqtt.connect("ws://localhost:9001");

client.on("connect", function () {
  client.subscribe("inau/response", function (err) {});
  client.subscribe("inau/login", function (err) {});
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
  questions: Question[];
  index: number;
  responses: any;
  //   increase: (by: number) => void;
  publish: (uuid: string) => void;
  addUser: (user: any) => void;
  addResponse: (response: any) => void;
  setIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
}

const useStore = create<ControlState>()(
  devtools(
    (set, get) => ({
      uuid: v4(),
      users: [],
      questions: [
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
          numberOfSelections: 1
        },
        {
          uuid: v4(),
          type: "MULTIPLE_CHOICE",
          img: "https://cataas.com/cat/says/test",
          text: "which option fits best.",
          options: ["hot", "boring", "cute", "decent"],
          numberOfSelections: 2
        },
      ],
      index: 0,
      responses: {},
      publish: (uuid) => {
        const question = get().questions.find((q) => q.uuid === uuid);
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
        if (index < get().questions.length) {
          set({ index });
          get().publish(get().questions[index].uuid);
        }
      },
      previous: () => {
        const index = get().index - 1;
        if (index >= 0) {
          set({ index });
          get().publish(get().questions[index].uuid);
        }
      },
      setIndex: (index) => {
        set({ index });
        get().publish(get().questions[index].uuid);
      },
    }),
    { name: "control" }
  )
);

export default useStore;
