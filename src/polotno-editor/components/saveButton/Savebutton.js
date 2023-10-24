import React from "react";
import { Button } from "@blueprintjs/core";
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

  console.log(templatesId);
  return (
    <div className="toolbar_actions_container bp4-overflow-list">
      <CustomTooltip text="Download">
        <Button
          onClick={() => {
            store.saveAsImage();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
          </svg>
        </Button>
      </CustomTooltip>
      <CustomTooltip text="Delete Custom Template">
        <Button
          disabled={templatesId && false}
          onClick={() => {
            handleDeleteClick();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </Button>
      </CustomTooltip>
      <CustomTooltip text="Clear Page">
        <Button
          onClick={() => {
            store.clear({
              keepHistory: true,
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 576 512"
          >
            <path d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z" />
          </svg>
        </Button>
      </CustomTooltip>
      <Button onClick={saveHandler}>Export As</Button>
      {/* <Button
        onClick={() => {
          handleUpdateClick();
        }}
      >
        Update Template
      </Button> */}
    </div>
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
