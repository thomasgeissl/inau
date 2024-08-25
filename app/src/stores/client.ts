
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 } from "uuid";
import * as mqtt from "mqtt";
import NoSleep from '@uriopass/nosleep.js';

const client = mqtt.connect(import.meta.env.VITE_BROKER_URL);
const noSleep = new NoSleep();

interface ClientState {
  uuid: string;
  scene?: any;
  init: (id: string) => void;
  setScene: (scene: any) => void;
  respond: (value: any) => void;
}

const useStore = create<ClientState>()(
  devtools(
    persist(
      (set, get) => ({
        uuid: v4(),
        Question: null,
        init: (id: string) => {
          noSleep.enable();
          client.on("connect", function () {
            const uuid = useStore.getState().uuid;
            client.publish("inau/login", JSON.stringify({ uuid }));
            client.subscribe(`inau/${id}/scene`, function (err) {
              if (err) {
                console.log(`could not subscribe to inau/${id}/scene`);
              }
            });
          });

          client.on("message", function (topic, message) {
            switch (topic) {
              case `inau/${id}/scene`: {
                const scene = JSON.parse(message.toString())
                useStore.getState().setScene(scene);
                break;
              }
            }
          });
          setTimeout(()=>{
            // TODO: send heartbeat
          }, 10*1000)
        },
        setScene: (scene) => set(() => ({ scene })),
        respond: (value) => {
          // const payload = {
          //   user: get().uuid,
          //   question: get().scene?.uuid,
          //   value,
          // };
          // client.publish("inau/response", JSON.stringify(payload));
          // set({scene: null})
        },
      }),
      {
        name: "client-storage", // name of the storage (must be unique)
        partialize: (state) => ({ uuid: state.uuid, 
          // scene: state.scene
         }), // only persist the uuid and scene
      }
    )
  )
);

export default useStore;
