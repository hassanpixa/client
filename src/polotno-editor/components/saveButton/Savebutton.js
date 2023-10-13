import React from "react";
import { Button } from "@blueprintjs/core";
import { useState } from "react";


const Savebutton = ({ store }) => {

  const [templates, setTemplates] = useState({
    total_pages: 0,
    items: [],
  });
  let counter = 0
  // const saveHandler = async () => {
  //   try {
  //     const pic = await store.toDataURL();
  //     const json = await store.toJSON();
      
  //     const now = new Date();
  //     const timestamp = now.toISOString().replace(/[:.]/g, "-"); // Replace invalid characters with hyphens
  
  //     // Replace any remaining invalid characters in the timestamp with underscores
  //     const validTimestamp = timestamp.replace(/[^a-zA-Z0-9-_]/g, "_");
  
  //     const newTemplate = {
  //       json: json,
  //       preview: pic,
  //     };
  //     counter++;
  
  //     setTemplates((prevTemplates) => ({
  //       total_pages: counter,
  //       items: [...prevTemplates.items, { ...newTemplate }],
  //     }));
  
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
  
  //     // Create and save JSON file with valid timestamp in the name
  //     const jsonFileHandle = await templatesDirectory.getFileHandle(
  //       `template_${validTimestamp}.json`,
  //       { create: true }
  //     );
  //     const jsonWritable = await jsonFileHandle.createWritable();
  //     await jsonWritable.write(jsonBlob);
  //     await jsonWritable.close();
  
  //     // Create and save PNG file with valid timestamp in the name
  //     const pngFileHandle = await templatesDirectory.getFileHandle(
  //       `template_${validTimestamp}.png`,
  //       { create: true }
  //     );
  //     const pngWritable = await pngFileHandle.createWritable();
  //     await pngWritable.write(pngBlob);
  //     await pngWritable.close();
  //   } catch (error) {
  //     console.error('Error saving files:', error);
  //   }
  // };
  
  const saveHandler = async () => {
    const jsonData = store.toJSON();

    const jsonString = JSON.stringify(jsonData, null, 2);

    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `data_${timestamp}_${randomString}.json`;

    const blob = new Blob([jsonString], { type: "application/json" });

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      alert("JSON file saved successfully!");
    } catch (error) {
      console.error("Error saving JSON file:", error);
      alert("Error saving JSON file. Check the console for details.");
    }
  };
  

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
