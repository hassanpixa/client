import "./App.css";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import {
  QrSection,
  getQR,
} from "polotno-editor/components/customQrTab/CustomQrTab";
import { DEFAULT_SECTIONS } from "polotno/side-panel";
import Savebutton from "./polotno-editor/components/saveButton/Savebutton";
import { CustomTemplateTab } from "polotno-editor/components/customTemplateTab/CustomTemplateTab";
import { CustomResizePanel } from "polotno-editor/components/customResizePanel/CustomResizePanel";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

// axios and end points
import axios from "api/axios";
import Endpoints from "api/Endpoints";

// import { useEffect } from "react";
import { payloadHandler } from "utils/payloadGenerator";
import { hidePopUpHandler } from "store/slices/uiSlice";
import { addTemplates } from "store/slices/templateSlice";
import { json } from "data";
// import createStore from "polotno/model/store";
function App({ polotnoStore }) {
  const ResizeSection = DEFAULT_SECTIONS.find(
    (section) => section.name === "size"
  );
  // overwrite its panel component
  ResizeSection.Panel = CustomResizePanel;
  const sections = [QrSection, CustomTemplateTab, ...DEFAULT_SECTIONS];
  // redux states
  const showPopUp = useSelector((state) => state.ui.showPopUp);
  const qrBtn = useSelector((state) => state.ui.addQr);
  const popUpImg = useSelector((state) => state.ui.popUpImg);
  const dispatch = useDispatch();

  const sendTemplate = async () => {
    const templateJson = await polotnoStore.toJSON();
    const data = {
      user_id: "1",
      settings: templateJson,
    };
    console.log(templateJson);
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const res = await axios.post(
        "https://car.develop.somomarketingtech.com/api/template",
        data,
        {
          withCredentials: true,
          xsrfHeaderName: "X-XSRF-TOKEN",
          headers: headers,
        }
      );
      console.log("data", res);
    } catch (error) {
      console.log("error in API", error.message);
    }
  };

  if (showPopUp) {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: !qrBtn,
      confirmButtonText: "Save",
      denyButtonText: `Cancel`,
      cancelButtonText: `Add Qr`,
      imageUrl: popUpImg,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      customClass: {
        confirmButton: "save_button_popUP",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        sendTemplate();

        // const json = await polotnoStore.toJSON();
        // const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        // dispatch(
        //   addTemplates({
        //     json,
        //     prev,
        //   })
        // );
        payloadHandler(polotnoStore).then((formData) => {
          // Use the formData object here
          // for (let it of formData) {
          //   console.log(it)
          // }
          // Send the formData as needed (e.g., via fetch)
        });
        // .catch((error) => {
        //   console.error("Error in payloadHandler:", error);
        // });
      } else if (result.isDenied) {
        dispatch(hidePopUpHandler());
      } else if (result.isDismissed) {
        // <<<<<<< HEAD
        //       Swal.fire("added QR");
        // =======
        // Swal.fire("Changes are not saved", "", "info");
        polotnoStore.openSidePanel("qr");
        // >>>>>>> e4a7a46130afbe5e9adc24806c784b95706a7d4e
      }

      // After showing the alert, dispatch an action to hide the popup
      dispatch(hidePopUpHandler());
    });
  }

  return (
    <>
      <PolotnoContainer
        style={{ width: "100vw", height: "100vh" }}
        className="polotno-app-container bp5-dark"
      >
        <SidePanelWrap>
          <SidePanel store={polotnoStore} sections={sections} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar
            store={polotnoStore}
            components={{ ActionControls: Savebutton }}
          />
          <Workspace store={polotnoStore} />
          <ZoomButtons store={polotnoStore} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </>
  );
}
export default App;
