import "./App.css";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { QrSection, getQR } from "./utils/polotnoQrSection";
import { DEFAULT_SECTIONS } from "polotno/side-panel";
import Savebutton from "./polotno-editor/components/saveButton/Savebutton";
import { CustomTemplateTab } from "./polotno-editor/components/customTemplateTab/CustomTemplateTab";
import { CustomResizePanel } from "./polotno-editor/components/customResizePanel/CustomResizePanel";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hidePopUpHandler } from "store/slices/uiSlice";
import createStore from "polotno/model/store";
function App({polotnoStore }) {
// Create a Polotno store without adding any initial page or element
// const polotnoStore = createStore();
// // polotnoStore.clear();
// polotnoStore.addPage()

// polotnoStore.setSize(1280, 800, true);

  // const val = 'https://polotno.com/';
  // getQR(val).then((src) => {
  //   store.activePage?.addElement({
  //     type: 'svg',
  //     name: 'qr',
  //     x: store.width / 2 - 150,
  //     y: store.height / 2 - 150,
  //     width: 300,
  //     height: 300,
  //     src,
  //     custom: {
  //       value: val,
  //     },
  //   });
  // });

  // we will have just two sections
  const ResizeSection = DEFAULT_SECTIONS.find(
    (section) => section.name === "size"
  );
  // overwrite its panel component
  ResizeSection.Panel = CustomResizePanel;
  const sections = [QrSection, CustomTemplateTab, ...DEFAULT_SECTIONS];





  const showPopUp = useSelector((state) => state.ui.showPopUp);
  const dispatch = useDispatch();
console.log(showPopUp)
if (showPopUp) {
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`,
    cancelButtonText: `Add Qr`,
    imageUrl: "https://unsplash.it/400/200",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Custom image",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }else if (result.isDismissed) {
      Swal.fire("added QR");
    }

    // After showing the alert, dispatch an action to hide the popup
    dispatch(hidePopUpHandler());
  });
}
  // useEffect(() => {
  //   if (showPopUp) {
  //     Swal.fire({
  //       title: "Do you want to save the changes?",
  //       showDenyButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: "Save",
  //       denyButtonText: `Don't save`,
  //       cancelButtonText: `Add Qr`,
  //       imageUrl: "https://unsplash.it/400/200",
  //       imageWidth: 400,
  //       imageHeight: 200,
  //       imageAlt: "Custom image",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         Swal.fire("Saved!", "", "success");
  //       } else if (result.isDenied) {
  //         Swal.fire("Changes are not saved", "", "info");
  //       }

  //       // After showing the alert, dispatch an action to hide the popup
  //       dispatch(hidePopUpHandler());
  //     });
  //   }
  // }, [showPopUp, dispatch]);
  return (
    <>
      <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
        <SidePanelWrap>
          <SidePanel store={polotnoStore} sections={sections} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={polotnoStore} components={{ ActionControls: Savebutton }} />
          <Workspace store={polotnoStore} />
          <ZoomButtons store={polotnoStore} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </>
  );
}
export default App;
