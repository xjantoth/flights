### Deployment steps:

If non-empty `/build` folder is present, then just proxy-pass your web-server to serve from this folder. In case there's no `/build` folder, one have to build the application from `/src`.

Make sure you're located in `/client` folder and execute:

```
npm install
```

Wait for dependencies to be installed and build the application using following command:

```
npm run build
```

Setup proxy-pass in web-server configuration file to serve from `/build` folder.
