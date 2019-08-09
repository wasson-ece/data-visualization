# Set up

To connect to a Ti board, make sure to set the ethernet connection subnet mask (Network and Sharing Center > IPv4 Settings > Use the following IP address form group):

IP address: `10.8.0.135`

Subnet mask: `255.255.255.0`

Every time you upgrade Electron, run `node sentry-symbols.js` to update symbol information for error reporting.

# Building

To run in development mode: `yarn start-dev`

To create a production release `yarn dist` (optionally with platform), which will create installation media and an unpacked executable in `./release`

# About

This project was bootstrapped from the [electron-react-typescript starter](git@github.com:Robinfr/electron-react-typescript.git).
