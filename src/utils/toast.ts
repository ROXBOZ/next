import { ANIMATION_DELAYS, Z_INDEX } from "@/constants/tarot";
import { ToastConfig, ToastType } from "@/types/tarot";

/**
 * Toast notification styles for different types
 */
const TOAST_STYLES: Record<ToastType, string[]> = {
  success: ["bg-green-800", "text-white"],
  error: ["bg-red-800", "text-white"],
  warning: ["bg-yellow-800", "text-white"],
  info: ["bg-blue-800", "text-white"],
};

/**
 * Show a toast notification
 * @param config - Toast configuration
 */
export const showToast = (config: ToastConfig | string): void => {
  // Handle string input for backwards compatibility
  const toastConfig: ToastConfig =
    typeof config === "string" ? { message: config, type: "error" } : config;

  const {
    message,
    type = "error",
    duration = ANIMATION_DELAYS.TOAST_HIDE,
  } = toastConfig;

  // Prevent duplicate toasts
  if (document.querySelector(".toast-notification")) {
    return;
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  const baseClasses = [
    "fixed",
    "top-5",
    "right-5",
    "text-sm",
    "xl:text-base",
    "px-3",
    "py-2",
    "rounded-md",
    "font-medium",
    `z-[${Z_INDEX.TOAST}]`,
    "shadow-lg",
    "transform",
    "translate-x-full",
    "transition-transform",
    "duration-300",
    "ease-out",
    "toast-notification",
  ];

  const typeClasses = TOAST_STYLES[type];
  const allClasses = [...baseClasses, ...typeClasses];

  toast.classList.add(...allClasses);
  document.body.appendChild(toast);

  // Show animation
  setTimeout(() => {
    toast.classList.remove("translate-x-full");
    toast.classList.add("translate-x-0");
  }, ANIMATION_DELAYS.TOAST_SHOW);

  // Hide animation
  setTimeout(() => {
    toast.classList.remove("translate-x-0");
    toast.classList.add("translate-x-full");

    // Remove from DOM
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, ANIMATION_DELAYS.TOAST_REMOVE);
  }, duration);
};

/**
 * Show a success toast
 * @param message - Success message
 */
export const showSuccessToast = (message: string): void => {
  showToast({ message, type: "success" });
};

/**
 * Show an error toast
 * @param message - Error message
 */
export const showErrorToast = (message: string): void => {
  showToast({ message, type: "error" });
};

/**
 * Show a warning toast
 * @param message - Warning message
 */
export const showWarningToast = (message: string): void => {
  showToast({ message, type: "warning" });
};

/**
 * Show an info toast
 * @param message - Info message
 */
export const showInfoToast = (message: string): void => {
  showToast({ message, type: "info" });
};
