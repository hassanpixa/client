import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@blueprintjs/core";

const AVAILABLE_SIZES = [
  { width: 1600, height: 720 },
  { width: 1200, height: 720 },
  { width: 1280, height: 800 }
];

export const CustomResizePanel = observer(({ store }) => {
  return (
    <div>
      {AVAILABLE_SIZES.map(({ width, height }, i) => (
        <Button
          key={i}
          style={{ width: "100%", marginBottom: "20px" }}
          onClick={() => {
            store.setSize(width, height,true);
          }}
        >
          {width}x{height}
        </Button>
      ))}
    </div>
  );
});