import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import * as mqtt from "mqtt";
import { Scene } from "../types/Scene";
import NoSleep from '@uriopass/nosleep.js';

const client = mqtt.connect("ws://localhost:9001");
const noSleep = new NoSleep();

interface ClientState {
  uuid: string;
  question?: Scene|null;
  init: () => void;
  setQuestion: (question: Scene) => void;
  respond: (value: any) => void;
}

const useStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      uuid: v4(),
      Question: null,
      init: () => {
        noSleep.enable();
        client.on("connect", function () {
          const uuid = useStore.getState().uuid;
          client.publish("inau/login", JSON.stringify({ uuid }));
          client.subscribe("inau/question", function (err) {
            if (err) {
              console.log("could not subscribe to", "inau/question");
            }
          });
          client.subscribe("test", function (err) {
            if (!err) {
              client.publish("test", "Hello mqtt");
            }
          });
        });

        client.on("message", function (topic, message) {
          console.log(topic, message.toString());
          switch (topic) {
            case "inau/question": {
              const question = JSON.parse(message.toString()) as Scene;
              console.log(question);
              useStore.getState().setQuestion(question);
              break;
            }
          }
        });
        setTimeout(()=>{
          // TODO: send heartbeat
        }, 10*1000)
      },
      setQuestion: (question) => set(() => ({ question })),
      respond: (value) => {
        const payload = {
          user: get().uuid,
          question: get().question?.uuid,
          value,
        };
        client.publish("inau/response", JSON.stringify(payload));
        set({question: null})
      },
    }),
    { name: "client" }
  )
);

export default useStore;
