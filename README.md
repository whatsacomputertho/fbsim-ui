# FBSim UI

> An web-based football simulation user interface which interacts with the FBSim API

## Overview

A simple ExpressJS web server which serves up a static web UI largely composed of browser-native vanilla JS web components. These components interact with the [FBSim REST API](https://github.com/whatsacomputertho/fbsim-api) over HTTP.

![A demo of the FBSim UI](doc/img/fbsim-ui-demo.gif)

## Usage

### Running the server

**Running locally via node**

Clone this repository and run `npm install` followed by `npm run dev`.  Before doing so, you may want to customize your environment variables in a `.env` file.  Accepted environment variables include the following, given with their default values:
```sh
# The IP and port to listen to
FBSIM_UI_DOMAIN=0.0.0.0
FBSIM_UI_PORT=8081

# The FBSim API host
FBSIM_API_HOST=http://localhost:8080
```

**Running locally in container**

Alternatively, to run the server as a container, one can `podman run` / `docker run` a published version of the image
```
ghcr.io/whatsacomputertho/fbsim-ui:v1.0.0-alpha.1
```

Or one can build locally by cloning this repository and running the following (here, `podman` can optionally be replaced with `docker`).
```sh
# Build the container image
podman build -f Containerfile . -t fbsim-ui:latest

# Run the container
podman run -it -p 8081:8081 fbsim-ui:latest
```
