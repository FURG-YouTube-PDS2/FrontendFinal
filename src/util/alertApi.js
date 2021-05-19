import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import

export const alert = (title, message, buttons = [{ label: "Confirmar" }]) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: buttons,
    closeOnEscape: false,
    closeOnClickOutside: false,
  });
};
