import Swal from "sweetalert2";

export const showLoadingAlert = (message) => {
    Swal.fire({
      title: `${message}...`,
      text: "Please wait a while",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  }