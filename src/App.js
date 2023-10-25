import "./App.css";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { QrSection } from "polotno-editor/components/customQrTab/CustomQrTab";
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
// import { payloadHandler } from "utils/payloadGenerator";
import { hidePopUpHandler } from "store/slices/uiSlice";
import { addTemplates, updateTemplates } from "store/slices/templateSlice";
import { showLoadingAlert } from "utils/showLoadingAlert";
import { showLoadedAlert } from "utils/showLoadedAlert";
// import { json } from "data";
// import { useState } from "react";
// import createStore from "polotno/model/store";
function App({ polotnoStore }) {
  // const [idTemplates, SetIdTemplates] = useState();
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
  const templatesId = useSelector((state) => state.templates.templateId);
  // const [id, SetId] = useState();
  // const loading = useSelector((state) => state.templates.loading);
  const dispatch = useDispatch();

 

  // function showSavingMessage() {
  //   Swal.fire({
  //     title: "Saving...",
  //     text: "Please wait while we save your data.",
  //     icon: "info",
  //     allowOutsideClick: false,
  //     showConfirmButton: false,
  //   });
  // }

  // function showSavedMessage() {
  //   Swal.fire({
  //     title: "Saved",
  //     text: "Your data has been saved successfully.",
  //     icon: "success",
  //   });
  // }

  // API HIT FOR TEMPLATES JSON
  const sendTemplateAPI = async () => {
    const templateJson = JSON.stringify(await polotnoStore.toJSON());
    console.log(templateJson,'Json of Template ')
    const data = {
      user_id: "1",
      settings: templateJson,
    };
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const res = await axios.post(Endpoints.template, data, {
        headers: headers,
      });
      // console.log("TEMPLATE API RESPONSE --------", res);
      // console.log("TEMPLATE ID --------", res?.data?.result?.template?.id);
      if (res.status === 200) {
        // showSavingMessage();
        const message = "Saving";
        showLoadingAlert(message);
      }
      // SetId(res?.data?.result?.template?.id);
      return res?.data?.result?.template?.id;
    } catch (error) {
      // console.log("error TEMPLATE API", error.message);
      Swal.fire("Error!", error.message, "Fail");
    }
  };

  // API HIT FOR MEDIA
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
  const mediaGenrator = async (id, type) => {
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
      // console.log(file, "----------file");
      payload.append("media[]", file);
      payload.append("user_id", "1");
      payload.append("other", "Ads");
      payload.append("device_type", key);
      
      if (type === "send") {
        payload.append("template_id", id);
        await sendImgAPI(payload, key, id);
        console.log("Post Media APi Hit");
      } else {
        payload.append("template_id", templatesId);
        console.log("Update Media APi Hit");
        await updateImgApi(payload, key);
      }
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
  const sendImgAPI = async (payload, key, id) => {

    for(let it of payload){
      console.log(it,'send media api')
    }
    const headers = {
      Accept: "application/json",
    };
    try {
      const res = await axios.post(Endpoints.sendMedia, payload, {
        headers: headers,
      });
      // console.log(`MEDIA-${key}`, res);
      if (key === "tv" && res.status === 200) {
        // showSavedMessage();
        const message = "Saved";
        showLoadedAlert(message);
        if (id) {
          const json = await JSON.stringify(await polotnoStore.toJSON());
          const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
          dispatch(
            addTemplates({
              json,
              prev,
              id,
            })
          );
        }
        return res.status
      }
    } catch (error) {
      // console.log(`error API MEDIA-${key}`, error.message);
      Swal.fire("Error!", error.message, "Fail");
    }
  };





  // Update API 
  const updateJsonAPI = async (updateData) => {
    const message = "Updating";
    showLoadingAlert(message);
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const res = await axios.post(
        `${Endpoints.template}/${templatesId}`,
        updateData,
        {
          headers: headers,
        }
      );

      // Assuming you want to store the response in the 'res' variable;
      const newJson = res?.data?.result?.template?.settings;
      console.log(res, "res");
      console.log("Updated successful:", newJson);
      return res.status;
    } catch (error) {
      Swal.fire("Error!", error.message, "Fail");
    }
  };

  const updateImgApi = async (payload, key) => {
    for(let it of payload){
      console.log(it,'update media api')
    }
    const headers = {
      Accept: "application/json",
    };
    try {
      const res = await axios.post(`${Endpoints.sendMedia}`, payload, {
        headers: headers,
      });
      // console.log(`MEDIA-${key}`, res);
      if (key === "tv" && res.status === 200) {
        // showSavedMessage();
        const message = "Updated";
        showLoadedAlert(message);
        // if (id) {
        //   const json = await JSON.stringify(await polotnoStore.toJSON());
        //   const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        //   dispatch(
        //     addTemplates({
        //       json,
        //       prev,
        //       id,
        //     })
        //   );
        // }
      }
      console.log(res,'res of upload media')
    } catch (error) {
      Swal.fire("Error!", error.message, "Fail");
    }
  };

  const handleUpdateClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const json = await JSON.stringify(await polotnoStore.toJSON());
        const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        const updateData = {
          settings: json,
        };
        const status = await updateJsonAPI(updateData);
        const type = "update";
        await mediaGenrator(type);
        if (status === 200) {
          const storeData = {
            id: templatesId,
            json: json,
            prev: prev,
          };
          dispatch(updateTemplates(storeData));
          Swal.fire("Updated!", "Template has been updated.", "success");
        } else {
          Swal.fire("Failed", "Template is Not Updated.", "Fail");
        }
      }
    });
  };

  if (showPopUp) {
    Swal.fire({
      title: "Do you want to save the changes?",
      html: `${!qrBtn ? `<button id="btn1" type="button" class="btn btn-custom popup_qr_button">Add Qr</button>` : ''}`,
      showDenyButton: templatesId && true,
      showCancelButton: true,
      confirmButtonText: "Save as New",
      denyButtonText: `Update Changes`,
      cancelButtonText: `Cancel`,
      showCloseButton: true,
      imageUrl: popUpImg,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      didOpen: () => {
        const btn1 = document?.getElementById("btn1");
        btn1?.addEventListener("click", () => {
          console.log("Button 1 Clicked");
          Swal.close();
          polotnoStore.openSidePanel("qr");
          // Call your custom function for Button 1 here
        });
      },

      customClass: {
        confirmButton: "save_button_popUP",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const id = await sendTemplateAPI();
        const type = "send";
        await mediaGenrator(id, type);
      } else if (result.isDenied) {
        // dispatch(hidePopUpHandler());
        handleUpdateClick();
      } else if (result.isDismissed) {
        dispatch(hidePopUpHandler());
      }
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
