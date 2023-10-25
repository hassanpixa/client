import Swal from "sweetalert2";

export const  showLoadedAlert = (message) => {
    Swal.fire({
      title: message,
      text: `Your data has been ${message} successfully.`,
      icon: "success",
    });
  }