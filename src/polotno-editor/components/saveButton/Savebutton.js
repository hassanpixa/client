import React from "react";
import { Button } from "@blueprintjs/core";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { showPopUpHandler } from "store/slices/uiSlice";
const payload = new FormData();
const urltoFile = async (url, filename, mimeType) => {
  // Implement the function to convert a URL to a file and return it.
  // This implementation can vary depending on your project's requirements.
  // For example, you might use the Fetch API to download the URL content and create a Blob.

  // Example:
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

// Usage:
// const file = await urltoFile(url, 'example.jpg', 'image/jpeg');

const Savebutton = ({ store }) => {
  const dispatch = useDispatch();

 

  // const [payload,setPayload]=useState({})
  let json = {};
  const saveHandler = async () => {
    dispatch(showPopUpHandler());

    json = JSON.stringify(await store.toJSON());
    payload.append("json", json);
    const data = new Date();
    //  // mobile
    store.setSize(1600, 720, true);
    const mobileUrl = await store.toDataURL({ mimeType: "image/jpg" });
    const file1 = await urltoFile(
      mobileUrl,
      data.getTime() + ".jpg",
      "image/jpeg"
    );
    payload.append("mobile", file1);
    // tab
    store.setSize(1280, 800, true);

    const tabUrl = await store.toDataURL({ mimeType: "image/jpg" });
    const file2 = await urltoFile(
      tabUrl,
      data.getTime() + ".jpg",
      "image/jpeg"
    );
    payload.append("tab", file2);
    //  payload.push({
    //   tabUrl:file3
    // });

    //  payload.push({
    //   mobileUrl:file3
    // });
    // tv file
    store.setSize(1280, 720, true);
    const tvUrl = await store.toDataURL({ mimeType: "image/jpg" });
    const file3 = await urltoFile(tvUrl, data.getTime() + ".jpg", "image/jpeg");
    payload.append("tv", file3);

    //  payload.push({
    //   tvUrl:file3
    // });
    // setPayload({
    //   json:json,
    //   types: payload
    // })
    for (const [key, value] of payload) {
      console.log(`${key}: ${value}\n`);
    }
    // console.log( payload)
  };
  for (const [key, value] of payload) {
    console.log(`${key}: ${value}\n`);
  }
  return (
    <div>
      <Button
        onClick={() => {
          store.saveAsImage({ pixelRatio: 0.2 });
        }}
      >
        Download Preview
      </Button>
      <Button onClick={saveHandler}>Save</Button>
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
