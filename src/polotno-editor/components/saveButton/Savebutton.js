import React from "react";
import { Button } from "@blueprintjs/core";
import { useState } from "react";


const Savebutton = ({ store }) => {
  const [payload,setPayload]=useState({})
let previews=[]
let json={}
const saveHandler=async()=>{
  json=await store.toJSON()
  // const Date = new Date();
  //tab 
  store.setSize(1280, 800, true);
  const tabUrl = await store.toDataURL({ mimeType: 'image/jpg' });
  previews.push({
    tabUrl:tabUrl
  });
  // mobile
  store.setSize(1600, 720, true);
  const mobileUrl = await store.toDataURL({ mimeType: 'image/jpg' });
  previews.push({
    mobileUrl:mobileUrl
  });
  //tv
  store.setSize(1280, 720, true);
  const tvUrl = await store.toDataURL({ mimeType: 'image/jpg' });
  previews.push({
    tvUrl:tvUrl
  });
  setPayload({
    json:json,
    types:previews
  })
}
console.log(payload)
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
 