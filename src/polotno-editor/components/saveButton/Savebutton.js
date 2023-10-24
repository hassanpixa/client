import React from "react";
import { Button, Menu, MenuDivider, MenuItem, Card } from "@blueprintjs/core";
import { Tooltip2, Popover2 } from "@blueprintjs/popover2";
// import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import axios from "api/axios";
import Endpoints from "api/Endpoints";
import {
  showPopUpHandler,
  popUpImgHandler,
} from "../../../store/slices/uiSlice";
import {
  // addId,
  removeTemplates,
  // updateTemplates,
} from "store/slices/templateSlice";
import CustomTooltip from "components/custom-tooltip/CustomTooltip";

const Savebutton = ({ store }) => {
  const dispatch = useDispatch();
  const showPopUp = useSelector((state) => state.ui.showPopUp);
  const templatesId = useSelector((state) => state.templates.templateId);

  const saveHandler = async () => {
    if (!showPopUp) {
      const imgUrl = await store.toDataURL();

      dispatch(popUpImgHandler(imgUrl));
      dispatch(showPopUpHandler());
    } else {
      return;
    }
  };

  // const deleteHandler = async () => {
  //   try {
  //     // Send a DELETE request using Axios
  //     await axios.delete(
  //       `https://car.develop.somomarketingtech.com/api/template/${templatesId}`
  //     );
  //     // Handle success or perform any additional actions
  //     console.log("Delete request successful");
  //     dispatch(addId(null));
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error while making the DELETE request:", error);
  //   }
  // };

  const deleteAPI = async () => {
    try {
      // Send a DELETE request using Axios
      const res = await axios.delete(`${Endpoints.template}/${templatesId}`);
      // Handle success or perform any additional actions
      // console.log("Delete request", res);
      return res.status;
    } catch (error) {
      // Handle errors
      Swal.fire("Error!", error.message, "Fail");
      // console.error("Error while making the DELETE request:", error.message);
    }
  };

  const handleDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const status = await deleteAPI();
        if (status === 200) {
          // console.log(status, "delete status");
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          dispatch(removeTemplates(templatesId));
          store.clear();
        } else {
          Swal.fire("Failed", "Your file is Not Deleted.", "Fail");
        }
      }
    });
  };

  // const updateAPI = async (updateData) => {
  //   try {
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     };
  //     const res = await axios.post(
  //       `${Endpoints.template}/${templatesId}`,
  //       updateData,
  //       {
  //         headers: headers,
  //       }
  //     );

  //     // Assuming you want to store the response in the 'res' variable;
  //     const newJson = res?.data?.result?.template?.settings;
  //     console.log(res, "res");
  //     console.log("Update successful:", newJson);
  //     return res.status;
  //   } catch (error) {
  //     Swal.fire("Error!", error.message, "Fail");
  //   }
  // };

  // const handleUpdateClick = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, Update it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const json = await JSON.stringify(await store.toJSON());
  //       const updateData = {
  //         setting: json,
  //       };
  //       const status = await updateAPI(updateData);
  //       if (status === 200) {
  //         const storeData = {
  //           id: templatesId,
  //           json: json,
  //         };
  //         dispatch(updateTemplates(storeData));
  //         Swal.fire("Updated!", "Template has been updated.", "success");
  //       } else {
  //         Swal.fire("Failed", "Template is Not Updated.", "Fail");
  //       }
  //     }
  //   });
  // };

  const exampleMenu = (
    <Menu
      style={{ display: "flex", flexDirection: "column", alignItems: "start" }}
    >
      <Button
        icon="download"
        className="toolbar_buttons"
        onClick={() => {
          store.saveAsImage();
        }}
      >
        Download
      </Button>
      <Button
        icon="delete"
        className="toolbar_buttons"
        disabled={templatesId ? false : true}
        onClick={() => {
          handleDeleteClick();
        }}
      >
        Delete
      </Button>
      <Button
        icon="clean"
        className="toolbar_buttons"
        onClick={() => {
          store.clear({
            keepHistory: true,
          });
        }}
      >
        Clean Page
      </Button>
      <Button onClick={saveHandler} icon="export" className="toolbar_buttons">
        Export
      </Button>
    </Menu>
  );

  console.log(templatesId);
  return (
    <>
      {/* <Popover2 content={exampleMenu} fill={true} placement="bottom">
        <Button
          alignText="left"
          fill={true}
          icon="applications"
          rightIcon="caret-down"
          text="Actions"
        />
      </Popover2> */}

      <div className="toolbar_actions_container bp4-overflow-list">
        <Tooltip2
          content="Download"
          position="bottom"
          openOnTargetFocus={false}
        >
          <Button
            icon="download"
            className="toolbar_buttons"
            onClick={() => {
              store.saveAsImage();
            }}
          ></Button>
        </Tooltip2>
        <Tooltip2 content="Delete Custom Template" position="bottom">
          <Button
            icon="delete"
            className="toolbar_buttons"
            disabled={templatesId ? false : true}
            onClick={() => {
              handleDeleteClick();
            }}
          ></Button>
        </Tooltip2>
        <Tooltip2 content="Clear Page" position="bottom">
          <Button
            icon="clean"
            className="toolbar_buttons"
            onClick={() => {
              store.clear({
                keepHistory: true,
              });
            }}
          ></Button>
        </Tooltip2>
        <Tooltip2 content="Export" position="bottom">
          <Button
            onClick={saveHandler}
            icon="export"
            className="toolbar_buttons"
          ></Button>
        </Tooltip2>
      </div>
    </>
  );
};

export default Savebutton;
// setTimeout(async()=>{
//   // mobile
//   const mbDate=new Date();
// await store.setSize(1600, 720, true);
// const mobileUrl = await  store.toDataURL({ mimeType: 'image/jpg' });
// const file1= await urltoFile(mobileUrl, mbDate.getTime() + '.jpg', 'image/jpeg')
// payload.append("mobile",file1)
// setTimeout(async()=>{
// await store.setSize(1280, 800, true);
// const data=new Date();
// const tabUrl = await  store.toDataURL({ mimeType: 'image/jpg' });
// const file2= await urltoFile(tabUrl, data.getTime() + '.jpg', 'image/jpeg')
// payload.append("tab",file2,)
// setTimeout(async ()=>{
//   const tvDate=new Date();
//   await store.setSize(1280, 720, true);
//   const tvUrl = await  store.toDataURL({ mimeType: 'image/jpg' });
//   const file3= await urltoFile(tvUrl, tvDate.getTime() + '.jpg', 'image/jpeg')
//    payload.append("tv",file3)
//    store.setSize(1280, 800, true);
// },200)
// },200)
// },200)
//  file handle logic
// const [counter,SetCounter] = useState(0)
// const saveHandler = async () => {
//   SetCounter(counter + 1)
//   try {
//     const pic = await store.toDataURL();
//     const json = await store.toJSON();

//     console.log('pic', pic);
//     console.log('json', json);

//     // Create a Blob with the JSON content
//     const jsonBlob = new Blob([JSON.stringify(json)], {
//       type: "application/json",
//     });

//     // Create a Blob with the PNG image (Assuming store.saveAsImage returns a data URL)
//     const pngBlob = new Blob([await (await fetch(pic)).blob()], {
//       type: "image/png",
//     });

//     // Log the size of the PNG blob to help diagnose issues
//     console.log('PNG Blob Size:', pngBlob.size);

//     // Create a file handle for the "templates" directory
//     const templatesDirectory = await window.showDirectoryPicker();

//     // Create and save JSON file
//     const jsonFileHandle = await templatesDirectory.getFileHandle(
//       "template.json",
//       { create: true }
//     );
//     const jsonWritable = await jsonFileHandle.createWritable();
//     await jsonWritable.write(jsonBlob);
//     await jsonWritable.close();

//     // Create and save PNG file
//     const pngFileHandle = await templatesDirectory.getFileHandle(
//       "template.png",
//       { create: true }
//     );
//     const pngWritable = await pngFileHandle.createWritable();
//     await pngWritable.write(pngBlob);
//     await pngWritable.close();
//   } catch (error) {
//     console.error('Error saving files:', error);
//   }
// };
