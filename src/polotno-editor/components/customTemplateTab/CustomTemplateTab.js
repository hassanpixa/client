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
import { useSelector } from "react-redux";
// dummy store slice for img grid

export const TemplatesPanel = observer(({ store }) => {
const templates=useSelector(state=>state.templates.templates) 
  
 

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
    
      <ImagesGrid
        shadowEnabled={false}
        // images={data?.map((data) => data.items).flat()}
        // images={[{ preview: imageBase64, json: Jsondata }]}
        images={templates?.map((data) => data.prev).flat()}
        getPreview={(item) => {
          // console.log(objectArray[0].prev)
          
          const obj= templates?.find(it=>it.prev===item)
          // console.log(item)
          // setLoading(true)
          return obj?.prev
        }}
        // isLoading={loading}
        onSelect={async(item) => {
          
          // setLoading(true)
          const obj = templates?.find(it => it.prev === item)
          
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
