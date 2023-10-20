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
import { useState } from "react";
// import createStore from "polotno/model/store";
function App({ polotnoStore }) {
  const [idTemplates, SetIdTemplates] = useState();
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

  const urltoFile = async (url, filename, mimeType) => {
    const response = await fetch(url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return new File([blob], filename, { type: blob.type });
      });
    return response;
  };

  // API HIT FOR TEMPLATES JSON
  const sendTemplate = async () => {
    const templateJson = JSON.stringify(await polotnoStore.toJSON());
    const data = {
      user_id: "1",
      settings: templateJson,
    };
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const res = await axios.post(
        "https://car.develop.somomarketingtech.com/api/template",
        data,
        {
          headers: headers,
        }
      );
      console.log("TEMPLATE API RESPONSE --------", res);
      console.log("TEMPLATE ID --------", res?.data?.result?.template?.id);
      return res?.data?.result?.template?.id
    } catch (error) {
      console.log("error TEMPLATE API", error.message);
    }
  };



  // API HIT FOR MEDIA
  const sendImage = async (id) => {
    const sizes = [
      { width: 1600, height: 720 }, // mobile
      { width: 1280, height: 720 }, // tab
      { width: 1280, height: 800 }, // tv
    ];
    const keys = ["mobile", "tab", "tv"];
    async function processSizeAndAppendToPayload(width, height, key) {
      // console.log(width, height, key, "DATA");
      const payload = new FormData();
      const data = new Date();
      await polotnoStore.waitLoading();
      polotnoStore.setSize(width, height, true);
      const url = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
      const file = await urltoFile(url, data.getTime() + ".jpg", "image/jpeg");
      console.log(file, "----------file");
      payload.append("media[]", file);
      payload.append("user_id", "1");
      payload.append("other", "Ads");
      payload.append("device_type", key);
      payload.append("template_id",id);
      await imgAPI(payload, key);
    }
    (async () => {
      for (let i = 0; i < sizes.length; i++) {
        await processSizeAndAppendToPayload(
          sizes[i].width,
          sizes[i].height,
          keys[i]
        );
      }
    })();
  };
  const imgAPI = async (payload, key) => {
    // for (let it of payload) {
    //   console.log(it, key);
    // }
    const headers = {
      Accept: "application/json",
    };
    try {
      const res = await axios.post(
        "https://car.develop.somomarketingtech.com/api/upload-media",
        payload,
        {
          headers: headers,
        }
      );
      console.log(`MEDIA-${key}`, res);
    } catch (error) {
      console.log(`error API MEDIA-${key}`, error.message);
    }
  };




  // const sendImage = async () => {
  //   const payload = new FormData();
  //   const data = new Date();
  //   //mobile
  //   polotnoStore.setSize(1600, 720);
  //   const mobileUrl = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
  //   const file1 = await urltoFile(
  //     mobileUrl,
  //     data.getTime() + ".jpg",
  //     "image/jpeg"
  //   );
  //   payload.append("mobile", file1);

  //   // tab
  //   polotnoStore.setSize(1280, 800);

  //   const tabUrl = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
  //   const file2 = await urltoFile(
  //     tabUrl,
  //     data.getTime() + ".jpg",
  //     "image/jpeg"
  //   );
  //   payload.append("tab", file2);

  //   // tv
  //   polotnoStore.setSize(1280, 720);
  //   const tvUrl = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
  //   const file3 = await urltoFile(tvUrl, data.getTime() + ".jpg", "image/jpeg");
  //   payload.append("tv", file3);

  //   polotnoStore.setSize(1280, 800, true);

  //   try {
  //     const res = await axios.post(
  //       "http://somo-marketing.local/api/upload-media",
  //       payload,
  //       {
  //         withCredentials: true,
  //         xsrfHeaderName: "X-XSRF-TOKEN",
  //       }
  //     );
  //     console.log("data", res);
  //   } catch (error) {
  //     console.log("error in API", error.message);
  //   }
  //   for (let it of payload) {
  //     console.log(it);
  //   }
  // };

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
        const id =  await  sendTemplate();
        await sendImage(id);
        // const json = await polotnoStore.toJSON();
        // const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        // dispatch(
        //   addTemplates({
        //     json,
        //     prev,
        //   })
        // );
        // payloadHandler(polotnoStore).then((formData) => {
        //   Use the formData object here
        //   for (let it of formData) {
        //     console.log(it)
        //   }
        //   Send the formData as needed (e.g., via fetch)
        // });
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
