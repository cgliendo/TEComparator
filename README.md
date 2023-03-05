# TE Comparator

This is a web application that allows you to compare seleceted countries by indicators provided by the TE API. It uses React to create the frontend, and a ws server to handle and process requests.

Here are some examples of output:

![example-2](./screenshots/example-2.png)

## Running the app

In order to get the app running, first install dependencies and start the server.
The server listens for requests coming in from the front-end application and processes data.
```
npm install
node server/server.js
```

Then, start the front-end application by running
```
npm start
```

