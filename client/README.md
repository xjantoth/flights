### Deployment steps:

1.  If non-empty `/build` folder is present, then just proxy-pass your web-server to serve from this folder. In case there's no `/build` folder, one have to build the application from `/src`.

2.  Make sure you're located in `/client` folder and execute:

```bash
npm install
```

3.  Wait for _dependencies_ to be installed.
4.  Build the application using following command:

```bash
npm run build
```

5.  Proxy-pass your web-server to serve from `/build` folder.
