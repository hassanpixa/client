import React from "react";
import { Button } from "@blueprintjs/core";

const saveHandler = async (pg) => {
  // Create a Blob with the JSON content
  const jsonBlob = new Blob([JSON.stringify(pg)], { type: "application/json" });

  // Create a Blob with the PNG image (Assuming store.saveAsImage returns a data URL)
  const pngBlob = new Blob([await (await fetch(pg.image)).blob()], { type: "image/png" });

  // Create a file handle for the "templates" directory
  const templatesDirectory = await window.showDirectoryPicker();
  
  // Create and save JSON file
  const jsonFileHandle = await templatesDirectory.getFileHandle("template.json", { create: true });
  const jsonWritable = await jsonFileHandle.createWritable();
  await jsonWritable.write(jsonBlob);
  await jsonWritable.close();

  // Create and save PNG file
  const pngFileHandle = await templatesDirectory.getFileHandle("template.png", { create: true });
  const pngWritable = await pngFileHandle.createWritable();
  await pngWritable.write(pngBlob);
  await pngWritable.close();
};

const Savebutton = ({ store }) => {
  return (
    <div>
      <Button
        onClick={() => {
          store.saveAsImage({ pixelRatio: 0.2 });
        }}
      >
        Download Preview
      </Button>
      <Button
        onClick={() => {
          saveHandler(store.toJSON());
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default Savebutton;
