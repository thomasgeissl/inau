import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 } from "uuid";
import * as mqtt from "mqtt";
import NoSleep from "@uriopass/nosleep.js";
import axios from "axios";

const client = mqtt.connect(import.meta.env.VITE_BROKER_URL);
const noSleep = new NoSleep();
let inited = false;

interface ClientState {
  uuid: string;
  showId: string;
  scene?: any;
  init: (id: string) => void;
  setScene: (scene: any) => void;
  publish: (value: any) => void;
}

const useStore = create<ClientState>()(
  devtools(
    persist(
      (set, get) => ({
        uuid: "",
        showId: "",
        scene: null,
        init: (id: string) => {
          if (inited) {
            return;
          }
          inited = true;
          const { uuid } = get();
          set({ showId: id });
          // make sure state has been loaded and then create a new user
          if (uuid === "") {
            axios
              .post(
                `${import.meta.env.VITE_CMS_BASEURL}/items/users`,
                JSON.stringify({
                  status: "published",
                }),
                { headers: { "Content-Type": "application/json" } }
              )
              .then((response) => {
                console.log("created", response);
                set({ uuid: response.data.data.id });
              })
              .catch((error) => {
                console.log(error);
              });
          }
          noSleep.enable();
          client.on("connect", function () {
            const uuid = useStore.getState().uuid;
            client.publish(`inau/${id}/login`, JSON.stringify({ uuid }));
            client.subscribe(`inau/${id}/scene`, function (err) {
              if (err) {
                console.log(`could not subscribe to inau/${id}/scene`);
              }
            });
          });

          client.on("message", function (topic, message) {
            switch (topic) {
              case `inau/${id}/scene`: {
                const scene = JSON.parse(message.toString());
                useStore.getState().setScene(scene);
                break;
              }
            }
          });
          setInterval(() => {
            const { uuid, showId } = get();
            // const newUpdatedAt = new Date().toISOString(); // Current timestamp in ISO format
            axios
              .patch(
                `${import.meta.env.VITE_CMS_BASEURL}/items/users/${uuid}`,
                JSON.stringify({
                  status: "published",
                  show: showId
                  // updated_at: newUpdatedAt,
                }),
                { headers: { "Content-Type": "application/json" } }
              )
              .then((response) => {  
                console.log("updated", response);
              })
              .catch((error) => {
                console.log(error);
              });
          }, 60 * 1000);
        },
        setScene: (scene) => set(() => ({ scene })),
        publish: (value) => {
          const { uuid, showId, scene } = get();

          // if (image) {
          //   const file: File | null = base64toFile(image, 'cam_capture.jpg');
          //   if (!file) {
          //     return;
          //   }
          //   const formData = new FormData();
          //   formData.append('folder', '0ee7bfc6-bd8d-4a03-8be3-2b574ee28028');
          //   formData.append('file', file);
          //   axios.post(`${FILES_URL}`, formData).then((response) => {
          //     axios
          //       .post(
          //       `${import.meta.env.VITE_CMS_BASEURL}/items/responses`,
          //         JSON.stringify({
          //           status: 'published',
          //           photo: response.data.data.id,
          //         }),
          //         { headers: { 'Content-Type': 'application/json' } },
          //       )
          //       .then((response) => {})
          //       .catch((error) => {
          //         console.log(error);
          //       });
          //   });

          axios
            .post(
              `${import.meta.env.VITE_CMS_BASEURL}/items/responses`,
              JSON.stringify({
                status: "published",
                user: uuid,
                show: showId,
                scene: scene?.id,
                value,
              }),
              { headers: { "Content-Type": "application/json" } }
            )
            .then((response) => {
              console.log("posted answer");
            })
            .catch((error) => {
              console.log(error);
            });
          // const payload = {
          //   user: get().uuid,
          //   question: get().scene?.uuid,
          //   value,
          // };
          // client.publish("inau/response", JSON.stringify(payload));
          set({ scene: null });
        },
      }),
      {
        name: "client",
        partialize: (state) => ({
          uuid: state.uuid,
        }),
      }
    )
  )
);

export default useStore;
