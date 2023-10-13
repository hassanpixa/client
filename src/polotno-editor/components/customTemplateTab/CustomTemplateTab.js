import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";
// import { Jsondata } from "../../../data";
import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";

// import { SectionTab } from 'polotno/side-panel';
// import MdPhotoLibrary from '@meronex/icons/md/MdPhotoLibrary';

import { ImagesGrid } from 'polotno/side-panel/images-grid';
import{generateImage} from '../../../utils/pngGenerator';
import {json} from '../../../data';
export const TemplatesPanel = observer(({ store }) => {
 
  // const [objectArray, setObjectArray] = useState([]);
 let objectArray=[]
// const urlGn=async(json)=>await store.toDataURL(json)
// for(let item of json){
//     // const pre= await urlGn(item)
//     objectArray.push( {
//       json:item,
//       prev: urlGn(item),
//     })
 
// }
//   console.log(objectArray)
  // const addObjectToArray = async(data) => {
  //   const pic = await store.toDataURL(data);
  //     const newObject = {
  //       json: data,
  //       prev: pic,
  //     };
  //   setObjectArray((prevArray) => [...prevArray, newObject]);
  // };
  // useEffect(() => {
  //   // Add your JSON data to the objectArray when the component mounts
  //   Jsondata.forEach((data) => {
  //     addObjectToArray(data);
  //   });
  // }, []);

  // load data
  // const { data, isLoading } = useInfiniteAPI({
  //   getAPI: ({ page }) => `templates/page${page}.json`,
  // });
// const pic=generateImage(json)
  return (
    <div style={{ height: "100%" }}>
      {/* <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data.items).flat()}
        getPreview={(item) => `/templates/${item.preview}`}
        isLoading={isLoading}
        onSelect={async (item) => {
          const req = await fetch(`/templates/${item.json}`);
          const json = await req.json();
          store.loadJSON(json);
        }}
        rowsNumber={1}
      /> */}
      <ImagesGrid
        shadowEnabled={false}
        // images={data?.map((data) => data.items).flat()}
        // images={[{ preview: imageBase64, json: Jsondata }]}
        images={objectArray?.map((data) => data).flat()}
        getPreview={(item) => {
          console.log(objectArray[0].prev)
          
          const obj= objectArray?.find(it=>it.prev===item?.prev)
          // console.log(item)
          // setLoading(true)
          return obj?.prev
        }}
        // isLoading={loading}
        onSelect={async(item) => {
          
          // setLoading(true)
          const obj = objectArray?.find(it => it.prev === item.prev )
          await store.loadJSON(obj.json);
        }}
        // rowsNumber={1}
      />
    </div>
  );
});

// define the new custom section
export const CustomTemplateTab = {
  name: "custom-templates",
  Tab: (props) => (
    <SectionTab name="Custom templates" {...props}>
      <MdPhotoLibrary />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: TemplatesPanel,
};
