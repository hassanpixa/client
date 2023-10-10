import React from "react";
import { Button } from "@blueprintjs/core";

const saveHandler = (pg) => {
  console.log(pg);
};
const Savebutton = ({ store }) => {
  return (
    <div>
      <Button
        onClick={() => {
          store.saveAsImage({ pixelRatio: 0.2 });
        }}
        // minimal
      >
        Download Preview
      </Button>
      <Button
        // minimal
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
