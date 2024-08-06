// REFER: https://patrickpassarella.com/blog/creating-electron-react-app

const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require("../src/shared/constants");
const path = require("path");
const { getEmployees } = require("./helper/api");
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

// End of the file
ipcMain.on(channels.USER_ACTION_UNAUTH, async (event, arg) => {
  try {
    let employees = [];
    try {
      employees = await getEmployees();
    } catch (err) {
      throw new Error("Unable to communicate with main!");
    }

    const { input, actionType } = arg;

    console.log(employees);
    console.log(input, actionType);
    if (actionType !== "login" || actionType !== "clock") {
      event.sender.send(channels.USER_ACTION_UNAUTH, {
        error: "Unknown Action type!",
      });
    }

    employees.forEach((emp) => {
      if (Number(emp["till_code"]) === input) {
        if (actionType !== "clock") {
          // Even if clocked-in, login by default!
          // Update backend to clock-in user
          event.sender.send(channels.USER_ACTION_UNAUTH, {
            message: `${emp["first_name"]} is clocked-in`,
          });
          return;
        }

        event.sender.send(channels.USER_ACTION_UNAUTH, {
          message: `${emp["first_name"]} is logged in`,
        });
        return;
      }
    });

    event.sender.send(channels.USER_ACTION_UNAUTH, {
      error: "Till code not found",
    });
  } catch (err) {
    event.sender.send(channels.USER_ACTION_UNAUTH, {
      error: err.message,
    });
  }
});
