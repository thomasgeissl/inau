# inau - Interactive Audience (WIP)

**inau** is a system for interactive live performances. It consists of a web app for smartphone clients, a web app to control the show, and a CMS to configure a show and collect data for later analytics.

Please note, it is currently being refactored and is not usable.

## Scene Types
Scenes consist of a text, media (image, video, lottie animation and an interactive component).

* **bool**: Yes/No kind of questions.
* **choice**: Multiple or single choice questions.
* **rating**: Star rating (1-5 stars).
* **photo**: Photo upload for users.
* **media**: this is non interactive, this type can be used to play back a video (muted, autoplay, non-looping)


## Features
* **real-time CMS updates**: content updates are immediately available in the control app, which is quite handy for the design and development phase
* **multiple shows**: one installation can host multiple shows in parallel
* **desktop app**: the control app can run as a standalone desktop application


## Usage
### CMS
* **start cms**: `cd cms && docker compose up -d`
* **apply db schema**: `docker exec -it inau sh`, `npx directus schema apply ./snapshots/current.yaml`
* **create a show**

### MQTT brocker
* **start brocker***: `cd brocker && docker compose up -d`

### web app
* **set variables in .env**: `code app/.env`
* **start web app**: `cd app && npm run dev`
* **control interface**: shows/{ID}/control
* **client interface**: shows/{ID}/run


### screenshots
![Control Screenshot](./doc/control.png)
![User Screenshot](./doc/user.png)