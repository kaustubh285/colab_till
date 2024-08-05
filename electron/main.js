// REFER: https://patrickpassarella.com/blog/creating-electron-react-app

const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require("../src/shared/constants");
const path = require("path");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;
const createWindow = () => {
  // Here, we are grabbing the React url from the env (which is on the start script)
  const startUrl = process.env.ELECTRON_START_URL;
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // And loading it in the window
  window.loadURL(startUrl);
  window.show();
  window.webContents.openDevTools({ mode: "detach" });
};
app.on("ready", () => {
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const products = {
  notebook: {
    name: "notebook",
    price: "2500",
    color: "gray",
  },
  headphone: {
    name: "headphone",
    price: "700",
    color: "black",
  },
};

// End of the file
ipcMain.on(channels.GET_DATA, (event, arg) => {
  const { product } = arg;
  event.sender.send(channels.GET_DATA, products[product]);
});
