import { ToastOptions } from "react-hot-toast";

const toastSuccessDefault: ToastOptions = {
    duration: 2200, // Toast will be displayed for 5 seconds
    style: {
        fontSize: '16px',
        backgroundColor: '#4CAF50', // Green for success
        color: '#fff',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
}

const toastErrorDefault: ToastOptions = {
    duration: 5000, // Toast will be displayed for 5 seconds
    style: {
        fontSize: '16px',
        backgroundColor: '#F44336', // Red for error
        color: '#fff',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
}

const toastInfoDefault: ToastOptions = {
    duration: 5000,
    style: {
        fontSize: '16px',
        backgroundColor: '#2196F3', // Blue for info
        color: '#fff',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
};


export { toastSuccessDefault, toastErrorDefault, toastInfoDefault }

