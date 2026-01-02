import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
};

export default ToastProvider;
