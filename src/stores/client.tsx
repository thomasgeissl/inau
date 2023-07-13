import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 } from "uuid";
import * as mqtt from "mqtt/dist/mqtt";
import { Question } from "../types/Question";

const client = mqtt.connect("ws://localhost:9001");

interface ClientState {
  uuid: string;
  question?: Question|null;
  init: () => void;
  setQuestion: (question: Question) => void;
  respond: (value: any) => void;
}

const useStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      uuid: v4(),
      Question: null,
      init: () => {
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
              const question = JSON.parse(message.toString()) as Question;
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
      setQuestion: (question) => set((state) => ({ question })),
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
