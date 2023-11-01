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
import {
  addId,
  addTemplates,
  updateTemplates,
} from "store/slices/templateSlice";
import { showLoadingAlert } from "utils/showLoadingAlert";
import { showLoadedAlert } from "utils/showLoadedAlert";
import { useEffect, useState } from "react";
import { urltoFile } from "utils/urltoFile";
// import { json } from "data";
// import { useState } from "react";
// import createStore from "polotno/model/store";
function App({ polotnoStore }) {
  // const [idTemplates, SetIdTemplates] = useState();
  const getFactor = (origalVal, targetedVal) => {
    const originalWidth = origalVal; // Original width in pixels
    const targetWidth = targetedVal; // Target width in pixels
    if (origalVal === targetedVal) {
      return 1;
    }
    const scaleFactor = targetWidth / originalWidth;
    // console.log(scaleFactor,  "scaleFactor")
    // const newMeasurement = originalWidth * scaleFactor;
    return scaleFactor;
  };

  const ResizeSection = DEFAULT_SECTIONS.find(
    (section) => section.name === "size"
  );
  // overwrite its panel component
  ResizeSection.Panel = CustomResizePanel;
  const sections = [QrSection, CustomTemplateTab, ...DEFAULT_SECTIONS];
  const filteredSections = sections.filter(
    (section) => section.name !== "templates"
  );
  // redux states
  const showPopUp = useSelector((state) => state.ui.showPopUp);
  // const qrBtn = useSelector((state) => state.ui.addQr);
  const popUpImg = useSelector((state) => state.ui.popUpImg);
  const templatesId = useSelector((state) => state.templates.templateId);
  // const [mediaId, setMediaId] = useState([]);
  // const [id, SetId] = useState();
  // const loading = useSelector((state) => state.templates.loading);
  let mediaIds = [];
  const dispatch = useDispatch();

  const emitEventToParent = () => {
    const message = {
      type: "sendMediaIdsToParent",
      data: JSON.stringify(mediaIds),
    };
    window.parent.postMessage(message, "*"); // '*' can be replaced with the parent window's origin for added security
    // console.log('event function  hit ',mediaIds)
  };

  // MEDIA GENERATOR START
  // const urltoFile = async (url, filename, mimeType) => {
  //   const response = await fetch(url)
  //     .then((res) => {
  //       return res.blob();
  //     })
  //     .then((blob) => {
  //       return new File([blob], filename, { type: mimeType });
  //     });
  //   return response;
  // };

  const mediaGenrator = async (id, type) => {
    const sizes = [
      { width: 1600, height: 720 }, // mobile
      { width: 1280, height: 720 }, // tv
      { width: 1280, height: 800 }, // tab
    ];
    const keys = ["Mobile", "TV", "Tab"];
    async function processSizeAndAppendToPayload(width, height, key) {
      // console.log(width, height, key, "DATA");
      const payload = new FormData();
      const data = new Date();
      await polotnoStore.waitLoading();
      // polotnoStore.activePage.set({ bleed: 20 }); // set bleed in pixels
      // polotnoStore.toggleBleed(true);
      // polotnoStore.toggleBleed(false);
      const originalWidth = await polotnoStore.width;
      const originalHeight = await polotnoStore.height;
      const widthFactor = getFactor(originalWidth, width);
      const heightFactor = getFactor(originalHeight, height);
      console.log("before", polotnoStore.width, polotnoStore.height);
      await polotnoStore.setSize(width, height);
      console.log("after", polotnoStore.width, polotnoStore.height);
      if (widthFactor) {
        // console.log(
        //   widthFactor,
        //   "Width factor ",
        //   heightFactor,
        //   "height factor"
        // );
        await polotnoStore.activePage?.children.forEach((element) => {
          // console.log(
          //   element.width,
          //   "original ELEMENT width",
          //   element.x,
          //   "x-axis",
          //   element.y,
          //   "y-axis"
          // );
          console.log(element, "ELEMENT PROPS");
          const name = element.name;
          const type = element.type;
          const fontFamily = element.fontFamily;
          const fontWeight = element.fontWeight;
          // console.log(type,'TYPE',name,'NAME')
          if (type === "text") {
            // console.log(
            //   element.fontSize,
            //   "BFORE TEXT ELEMENT",
            //   widthFactor,
            //   heightFactor
            // );
            element.set({
              fontSize:key === 'Mobile' && element.fontSize * heightFactor ||  element.fontSize * widthFactor,
              // fontSize:
              //   element.fontSize < 100
              //     ? element.fontSize * widthFactor
              //     : element.fontSize * heightFactor,
              // fontSize:
              //   fontFamily === "Rubik Mono One" ||
              //   fontFamily === "Press Start 2P" ||
              //   fontFamily === "Anton" ||
              //   fontFamily === "Open Sans"
              //     ? element.fontSize * heightFactor
              //     : element.fontSize * widthFactor,
              width:
                (key === "Mobile" && element.width * widthFactor) ||
                (key === "TV" && element.width * widthFactor) ||
                (key === "Tab" && element.width * widthFactor),
              height:  element.height * heightFactor,
              x: element.x * widthFactor,
              y: element.y * heightFactor,
              keepRatio: true,
              resizeable: true,
            });
            // console.log(element.fontSize, "after TEXT ELEMENT");
          } else if (name === "qr") {
            console.log("i am hit in", name);
            element.set({
              width: element.width * heightFactor,
              height: element.height * heightFactor,
              x: element.x * widthFactor,
              y: element.y * heightFactor,
              keepRatio: true,
              resizeable: true,
            });
          } else if (type === "svg") {
            console.log("I AM HIT IN ", type);
            element.set({
              width: element.width * widthFactor,
              height:  (key === "Mobile" && element.height * widthFactor) || element.height * heightFactor,
              x: element.x * widthFactor,
              y: element.y * heightFactor,
              keepRatio: true,
              resizeable: true,
            });
          } else {
            element.set({
              width: element.width * widthFactor,
              height: element.height * heightFactor,
              x: element.x * widthFactor,
              y: element.y * heightFactor,
              keepRatio: true,
              resizeable: true,
            });
          }

          // console.log(
          //   element.width,
          //   "new ELEMENT width",
          //   element.x,
          //   "x-axis",
          //   element.y,
          //   "y-axis"
          // );
        });
        const url = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        const file = await urltoFile(
          url,
          data.getTime() + ".jpg",
          "image/jpeg"
        );
        // console.log(file, "----------file");
        payload.append("media[]", file);
        payload.append("user_id", "1");
        payload.append("other", "Ads");
        payload.append("device_type", key);

        if (type === "send") {
          payload.append("template_id", id);
          const status = await sendImgAPI(payload, key, id);
          if (status) {
            polotnoStore.history.undo();
          }
          // console.log("Post Media APi Hit");
        } else {
          payload.append("template_id", templatesId);
          const status = await updateImgApi(payload, key);
          if (status) {
            polotnoStore.history.undo();
          }
          // console.log("Update Media APi Hit");
        }
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
  // MEDIA GENERATOR END
  // for (let i; i < this.store.selectedElements.length; i++){
  //   console.log(i);
  //   console.log("string");
  // }
  // const ids = this.store.pages;
  // this.store.pages.forEach(element => {
  //   //   console.log(element.id);
  //   element.children.forEach(child => {
  //     console.log(child.id);
  //     this.store.deleteElements([child.id]);
  //   });
  // });

  // ====================== POST API ============================
  // Json Post
  const sendTemplateAPI = async () => {
    const templateJson = JSON.stringify(await polotnoStore.toJSON());
    // console.log(templateJson, "Json of Template ");
    const data = {
      // user_id: "1",
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
        await polotnoStore.history.clear();
        const message = "Saving";
        showLoadingAlert(message);
      }
      // SetId(res?.data?.result?.template?.id);
      return res?.data?.result?.template?.id;
    } catch (error) {
      // console.log("error TEMPLATE API", error.message);
      // console.log(error.response.data,'template error on post')
      Swal.fire(
        "Error!",
        "Something went wrong! Please try closing the editor and come back again",
        "error"
      );
    }
  };
  // Media Post
  const sendImgAPI = async (payload, key, id) => {
    // for (let it of payload) {
    //   console.log(it, "send media api");
    // }
    const headers = {
      Accept: "application/json",
    };
    try {
      const res = await axios.post(Endpoints.sendMedia, payload, {
        headers: headers,
      });
      // console.log(`MEDIA-${key}`, res);
      mediaIds.push(res?.data?.result?.media[0]?.id);
      // console.log( mediaIds ,'======================')
      if (key === "Tab" && res.status === 200) {
        // showSavedMessage();

        if (id) {
          polotnoStore.history.undo();
          const json = await JSON.stringify(await polotnoStore.toJSON());
          const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
          dispatch(
            addTemplates({
              json,
              prev,
              id,
            })
          );
          const message = "Saved";
          showLoadedAlert(message);
          emitEventToParent();
        }
      }
      return res.status;
    } catch (error) {
      // console.log(`error API MEDIA-${key}`, error.message);
      Swal.fire(
        "Error!",
        "Something went wrong! Please try closing the editor and come back again",
        "error"
      );
    }
  };

  //========================== Update API========================

  // JSON UPDATE
  const updateJsonAPI = async (updateData) => {
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
      if (res.status === 200) {
        await polotnoStore.history.clear();
        const message = "Updating";
        showLoadingAlert(message);
      }
      const newJson = res?.data?.result?.template?.settings;
      // console.log(res, "res");
      // console.log("Updated successful:", newJson);
      return res.status;
    } catch (error) {
      Swal.fire(
        "Error!",
        "Something went wrong! Please try closing the editor and come back again",
        "error"
      );
    }
  };
  // IMAGE UPDATE
  const updateImgApi = async (payload, key) => {
    // for (let it of payload) {
    //   console.log(it, "update media api");
    // }
    const headers = {
      Accept: "application/json",
    };
    try {
      const res = await axios.post(`${Endpoints.updateMedia}`, payload, {
        headers: headers,
      });
      // console.log(`MEDIA-${key}`, res);
      // console.log(res, "res of upload media");
      // console.log(res?.data?.result?.media?.id, "id of upload media");
      mediaIds.push(res?.data?.result?.media?.id);
      if (key === "Tab" && res.status === 200) {
        if (templatesId) {
          polotnoStore.history.undo();
          const json = await JSON.stringify(await polotnoStore.toJSON());
          const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
          const storeData = {
            id: templatesId,
            json: json,
            prev: prev,
          };
          dispatch(updateTemplates(storeData));
          const message = "Updated";
          showLoadedAlert(message);
          emitEventToParent();
        }
      }
      return res.status;
    } catch (error) {
      Swal.fire(
        "Error!",
        "Something went wrong! Please try closing the editor and come back again",
        "error"
      );
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
        // const prev = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
        const updateData = {
          settings: json,
        };
        const status = await updateJsonAPI(updateData);
        if (status === 200) {
          const type = "update";
          await mediaGenrator(type);
        }
        // if (status === 200) {
        //   const storeData = {
        //     id: templatesId,
        //     json: json,
        //     prev: prev,
        //   };
        //   dispatch(updateTemplates(storeData));
        //   Swal.fire("Updated!", "Template has been updated.", "success");
        // } else {
        //   Swal.fire("Failed", "Template is Not Updated.", "Fail");
        // }
      }
    });
  };

  // Export Button for Save , Update , Add QR
  const element = polotnoStore?.getElementById("q");
  if (showPopUp) {
    Swal.fire({
      title: "Do you want to save the changes?",
      html: `${
        !element
          ? `<button id="btn1" type="button" class="btn btn-custom popup_qr_button">Add QR Code</button>`
          : ""
      }`,
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
          // console.log("Button 1 Clicked");
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
        if (id) {
          const type = "send";
          await mediaGenrator(id, type);
        }
      } else if (result.isDenied) {
        // dispatch(hidePopUpHandler());
        handleUpdateClick();
      } else if (result.isDismissed) {
        dispatch(hidePopUpHandler());
      }
      dispatch(hidePopUpHandler());
    });
  }
  polotnoStore.on("change", () => {
    const sidePanel = polotnoStore.openedSidePanel;
    if (sidePanel === "templates") {
      dispatch(addId(null));
    }
  });
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
            hideImageRemoveBackground
          />
          <Workspace store={polotnoStore} />
          <ZoomButtons store={polotnoStore} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </>
  );
}
export default App;
