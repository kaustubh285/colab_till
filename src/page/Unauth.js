import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { channels } from '../shared/constants';
import Keypad from '../components/Keypad';

const { ipcRenderer } = window.require('electron');
function Unauth() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [data, setData] = useState({});

    const printReceipt = (receiptType, data) => {
        ipcRenderer.send(channels.PRINT_TILL_RECIEPT, {
            receiptType,
            data,
        });
    };

    const verifyCode = () => {
        return true;
    };

    const handleClockEvent = () => {
        if (data) setData({});
        if (verifyCode()) {
            // alert(`${input} user clocked-in`);
            ipcRenderer.send(channels.USER_ACTION_UNAUTH, {
                input,
                actionType: 'clock',
            });
        } else {
            alert('no such user!');
            setInput('');
        }
        // Send the event to get the data
    };

    const handleLogin = () => {
        if (verifyCode()) {
            // alert(`${input} user logged-in`);

            ipcRenderer.send(channels.USER_ACTION_UNAUTH, {
                input,
                actionType: 'login',
            });
        } else {
            alert('no such user!');
            setInput('');
        }
    };

    useEffect(() => {
        // Listen for the event
        ipcRenderer.on(channels.USER_ACTION_UNAUTH, (event, arg) => {
            if (arg.error) {
                setData(arg);
                setTimeout(() => {
                    setData('');
                }, 3000);
            } else {
                console.log(
                    new Date().toLocaleDateString('en-US', {
                        dateStyle: 'medium',
                        day: 'numeric',
                    }),
                );
                return;
                printReceipt('clock-in', {
                    name: arg.user['name'],
                    time: new Date().toLocaleDateString('en-US', {
                        dateStyle: 'medium',
                        day: 'numeric',
                    }),
                });
                // localStorage.setItem('user_dets', JSON.stringify(arg.user));
                // navigate('/menu');
            }
        });
        // Clean the listener after the component is dismounted
        return () => {
            ipcRenderer.removeAllListeners();
        };
    }, []);

    return (
        <div className="h-screen w-screen">
            <div className=" absolute text-center right-1 top-1 toast text-2xl">
                {data?.error && (
                    <div
                        class="max-w-lg bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
                        role="alert"
                        tabindex="-1"
                        aria-labelledby="hs-toast-soft-color-red-label"
                    >
                        <div
                            id="hs-toast-soft-color-red-label"
                            class="flex p-4 space-x-3 text-xl"
                        >
                            {data.error}

                            <div class="ms-auto">
                                <button
                                    type="button"
                                    class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-red-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-red-200"
                                    aria-label="Close"
                                >
                                    <span class="sr-only">Close</span>
                                    <svg
                                        class="shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {data?.message && (
                    <div
                        class="max-w-xs bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                        role="alert"
                        tabindex="-1"
                        aria-labelledby="hs-toast-soft-color-yellow-label"
                    >
                        <div
                            id="hs-toast-soft-color-yellow-label"
                            class="flex p-4"
                        >
                            {data.message}

                            <div class="ms-auto">
                                <button
                                    type="button"
                                    class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-yellow-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-yellow-200"
                                    aria-label="Close"
                                >
                                    <span class="sr-only">Close</span>
                                    <svg
                                        class="shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-3 items-center justify-center h-full w-full bg-blue-100">
                <p className=" text-2xl font-semibold">{`{Cafe Name}`}</p>
                <p className=" text-xl">{`Login to access till or clock-in`}</p>
                <div onClick={() => printReceipt()}>Send signal!!!</div>
                <Keypad
                    input={input}
                    setInput={setInput}
                    handleLogin={handleLogin}
                    handleClockEvent={handleClockEvent}
                />
            </div>
        </div>
    );
}
export default Unauth;
