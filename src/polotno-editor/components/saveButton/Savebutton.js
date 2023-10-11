import React from "react";
import { Button } from "@blueprintjs/core";
import { useState } from "react";


const Savebutton = ({ store }) => {

  const [counter,SetCounter] = useState(0)
  const saveHandler = async () => {
    SetCounter(counter + 1)
    try {
      const pic = await store.toDataURL();
      const json = await store.toJSON();
  
      console.log('pic', pic);
      console.log('json', json);
  
      // Create a Blob with the JSON content
      const jsonBlob = new Blob([JSON.stringify(json)], {
        type: "application/json",
      });
  
      // Create a Blob with the PNG image (Assuming store.saveAsImage returns a data URL)
      const pngBlob = new Blob([await (await fetch(pic)).blob()], {
        type: "image/png",
      });
  
      // Log the size of the PNG blob to help diagnose issues
      console.log('PNG Blob Size:', pngBlob.size);
  
      // Create a file handle for the "templates" directory
      const templatesDirectory = await window.showDirectoryPicker();
  
      // Create and save JSON file
      const jsonFileHandle = await templatesDirectory.getFileHandle(
        "template.json",
        { create: true }
      );
      const jsonWritable = await jsonFileHandle.createWritable();
      await jsonWritable.write(jsonBlob);
      await jsonWritable.close();
  
      // Create and save PNG file
      const pngFileHandle = await templatesDirectory.getFileHandle(
        "template.png",
        { create: true }
      );
      const pngWritable = await pngFileHandle.createWritable();
      await pngWritable.write(pngBlob);
      await pngWritable.close();
    } catch (error) {
      console.error('Error saving files:', error);
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
