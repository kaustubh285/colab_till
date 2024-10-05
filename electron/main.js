// REFER: https://patrickpassarella.com/blog/creating-electron-react-app

const { app, BrowserWindow, ipcMain } = require('electron');
const { channels } = require('../src/shared/constants');
const path = require('path');
const { getEmployees } = require('./helper/api');
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
    window.webContents.openDevTools({ mode: 'detach' });
};
app.on('ready', () => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
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
            throw new Error('Unable to communicate with main!');
        }

        const { input, actionType } = arg;

        let responseSent = false;
        if (actionType !== 'login' || actionType !== 'clock') {
            event.sender.send(channels.USER_ACTION_UNAUTH, {
                error: 'Unknown Action type!',
            });
        }

        employees.forEach((emp) => {
            if (Number(emp['till_code']) == input) {
                if (actionType === 'clock') {
                    // Even if clocked-in, login by default!
                    // Update backend to clock-in user
                    console.log('Clocked in');
                    responseSent = true;
                    event.sender.send(channels.USER_ACTION_UNAUTH, {
                        message: `${emp['first_name']} is clocked-in`,
                        user: {
                            emp_id: emp['emp_id'],
                            name: emp['first_name'],
                            till_code: emp['till_code'],
                        },
                    });
                    return;
                }
                console.log('Logged in');
                responseSent = true;
                event.sender.send(channels.USER_ACTION_UNAUTH, {
                    message: `${emp['first_name']} is logged in`,
                    user: {
                        emp_id: emp['emp_id'],
                        name: emp['first_name'],
                        till_code: emp['till_code'],
                    },
                });
                return;
            }
        });

        if (!responseSent) {
            event.sender.send(channels.USER_ACTION_UNAUTH, {
                error: 'Till code not found',
            });
        }
    } catch (err) {
        event.sender.send(channels.USER_ACTION_UNAUTH, {
            error: err.message,
        });
    }
});

const net = require('net');

ipcMain.on(channels.PRINT_TILL_RECIEPT, async (event, arg) => {
    const COMMANDS = {
        INIT: Buffer.from([0x1b, 0x40]),
        BOLD_ON: Buffer.from([0x1b, 0x45, 0x01]),
        BOLD_OFF: Buffer.from([0x1b, 0x45, 0x00]),
        UNDERLINE_ON: Buffer.from([0x1b, 0x2d, 0x01]),
        UNDERLINE_OFF: Buffer.from([0x1b, 0x2d, 0x00]),
        ALIGN_LEFT: Buffer.from([0x1b, 0x61, 0x00]),
        ALIGN_CENTER: Buffer.from([0x1b, 0x61, 0x01]),
        ALIGN_RIGHT: Buffer.from([0x1b, 0x61, 0x02]),
        PAPER_CUT: Buffer.from([0x1d, 0x56, 0x41, 0x03]),
        FEED_LINE: Buffer.from([0x0a]),
    };

    const { receiptType, data } = arg;

    function printReceipt(ipAddress, port, type, args) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(port, ipAddress, () => {
                console.log('Connected to RawBT');

                let printData;
                if (type === 'clock') {
                    printData = generateClockReceipt(args);
                } else if (type === 'order') {
                    printData = generateNewOrderReceipt(args);
                } else {
                    reject(new Error('Invalid receipt type'));
                    return;
                }

                client.write(printData, () => {
                    console.log('Data sent to printer');
                    client.end();
                });
            });

            client.on('error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });

            client.on('close', () => {
                console.log('Connection closed');
                resolve();
            });
        });
    }

    function generateClockReceipt(args) {
        const { emp_name, action, time } = args;
        return Buffer.concat([
            COMMANDS.INIT,
            COMMANDS.ALIGN_CENTER,
            COMMANDS.BOLD_ON,
            Buffer.from(`Employee ${action.toUpperCase()}\n`),
            COMMANDS.BOLD_OFF,
            COMMANDS.ALIGN_LEFT,
            Buffer.from(`Name: ${emp_name}\n`),
            Buffer.from(`Time: ${time}\n`),
            Buffer.from(`Action: ${action}\n`),
            COMMANDS.FEED_LINE,
            COMMANDS.FEED_LINE,
            COMMANDS.PAPER_CUT,
        ]);
    }

    function generateNewOrderReceipt(args) {
        const {
            contents,
            allergies,
            time,
            paid,
            payment_method,
            table_no,
            order_id,
            emp_name,
        } = args;

        const itemNameMaxLength = 25; // Max length for the item name
        const qtyWidth = 5; // Width for the quantity column
        const priceWidth = 10; // Width for the price column

        // Formatting each item
        let itemsBuffer = Buffer.concat(
            contents.map((item) => {
                let itemLines = [];
                const fullItemName = item.item_name;

                // Split long item names into two lines if they exceed the max length
                if (fullItemName.length > itemNameMaxLength) {
                    const firstLine = fullItemName.slice(0, itemNameMaxLength);
                    const remainingLine = fullItemName.slice(itemNameMaxLength);
                    itemLines.push(`${firstLine.padEnd(itemNameMaxLength)}\n`);
                    itemLines.push(
                        `${remainingLine.padEnd(itemNameMaxLength)}${item.count.toString().padStart(qtyWidth)} ${(item.item_price_eat_in * item.count).toFixed(2).padStart(priceWidth)}\n`,
                    );
                } else {
                    // If item name fits on one line
                    itemLines.push(
                        `${fullItemName.padEnd(itemNameMaxLength)}${item.count.toString().padStart(qtyWidth)} ${(item.item_price_eat_in * item.count).toFixed(2).padStart(priceWidth)}\n`,
                    );
                }

                return Buffer.from(itemLines.join(''));
            }),
        );

        let totalAmount = contents.reduce(
            (sum, item) => sum + item.item_price_eat_in * item.count,
            0,
        );

        return Buffer.concat([
            COMMANDS.INIT,
            COMMANDS.ALIGN_CENTER,
            COMMANDS.BOLD_ON,
            Buffer.from('Cafe Name\n'), // Centered Cafe Name
            COMMANDS.BOLD_OFF,
            COMMANDS.ALIGN_LEFT,
            Buffer.from(
                `Order Id: ${order_id}`.padEnd(30) + `Table No: ${table_no}\n`,
            ), // Align Order ID and Table No
            Buffer.from(`Time: ${time}\n`),
            COMMANDS.FEED_LINE,
            Buffer.from(
                'Item'.padEnd(itemNameMaxLength) +
                    'Qty'.padStart(qtyWidth) +
                    'Price'.padStart(priceWidth) +
                    '\n',
            ),
            Buffer.from(
                ''.padEnd(itemNameMaxLength + qtyWidth + priceWidth, '-') +
                    '\n',
            ),
            itemsBuffer,
            Buffer.from(
                ''.padEnd(itemNameMaxLength + qtyWidth + priceWidth, '-') +
                    '\n',
            ),
            COMMANDS.ALIGN_RIGHT,
            Buffer.from(`Total: $${totalAmount.toFixed(2)}\n`),
            COMMANDS.ALIGN_LEFT,
            COMMANDS.FEED_LINE,
            allergies.length > 0
                ? Buffer.from(`Allergies : ${allergies.join(', ')}\n`)
                : Buffer.from(''),
            Buffer.from(`Paid : ${paid ? 'Yes' : 'No'}\n`),
            Buffer.from(`Payment Method : ${payment_method}\n`),
            COMMANDS.FEED_LINE,
            Buffer.from(`Served by: ${emp_name}\n`), // Center "Served by" info
            COMMANDS.FEED_LINE,
            COMMANDS.FEED_LINE,
            COMMANDS.PAPER_CUT,
        ]);
    }

    // Usage examples:
    const androidIP = '192.168.1.104'; // Replace with your Android device's IP address
    const port = 9100; // Default port for most receipt printers, but verify in RawBT settings

    if (receiptType === 'clock-in') {
        // Clock-in example
        printReceipt(androidIP, port, 'clock', {
            emp_name: data.name,
            action: 'clock-in',
            time: data.time + '09:00:00T05-10-2024',
        })
            .then(() => console.log('Clock-in receipt printed successfully'))
            .catch((error) =>
                console.error('Error printing clock-in receipt:', error),
            );
    } else if (receiptType === 'clock-out') {
        // Clock-in example
        printReceipt(androidIP, port, 'clock', {
            emp_name: data.name,
            action: 'clock-out',
            time: data.time + '09:00:00T05-10-2024',
        })
            .then(() => console.log('Clock-out receipt printed successfully'))
            .catch((error) =>
                console.error('Error printing clock-out receipt:', error),
            );
    } else if (receiptType === 'order') {
        // Order example
        const orderExample = {
            contents: [
                {
                    item_name: 'American cheese',
                    item_price_eat_in: 2,
                    count: 1,
                },
                {
                    item_name: 'Full English Breakfast',
                    item_price_eat_in: 7,
                    count: 1,
                },
            ],
            allergies: ['milk', 'soybeans'],
            time: '11:23:06T05-10-2024',
            paid: true,
            payment_method: 'card',
            table_no: 7,
            order_id: '#1918',
            emp_name: 'kaustubh',
        };

        printReceipt(androidIP, port, 'order', orderExample)
            .then(() => console.log('Order receipt printed successfully'))
            .catch((error) =>
                console.error('Error printing order receipt:', error),
            );
    }
});
