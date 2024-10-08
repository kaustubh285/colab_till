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
  window.loadURL(startUrl + "/menu");
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

    let responseSent = false;
    if (actionType !== "login" || actionType !== "clock") {
      event.sender.send(channels.USER_ACTION_UNAUTH, {
        error: "Unknown Action type!",
      });
    }

    employees.forEach((emp) => {
      if (Number(emp["till_code"]) == input) {
        if (actionType === "clock") {
          // Even if clocked-in, login by default!
          // Update backend to clock-in user
          console.log("Clocked in");
          responseSent = true;
          event.sender.send(channels.USER_ACTION_UNAUTH, {
            message: `${emp["first_name"]} is clocked-in`,
            user: {
              emp_id: emp["emp_id"],
              name: emp["first_name"],
              till_code: emp["till_code"],
            },
          });
          return;
        }
        console.log("Logged in");
        responseSent = true;
        event.sender.send(channels.USER_ACTION_UNAUTH, {
          message: `${emp["first_name"]} is logged in`,
          user: {
            emp_id: emp["emp_id"],
            name: emp["first_name"],
            till_code: emp["till_code"],
          },
        });
        return;
      }
    });

    if (!responseSent) {
      event.sender.send(channels.USER_ACTION_UNAUTH, {
        error: "Till code not found",
      });
    }
  } catch (err) {
    event.sender.send(channels.USER_ACTION_UNAUTH, {
      error: err.message,
    });
  }
});
