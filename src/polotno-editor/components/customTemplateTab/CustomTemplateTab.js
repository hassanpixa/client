import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInfiniteAPI } from "polotno/utils/use-api";
// import { Jsondata } from "../../../data";
import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";
import axios from "api/axios";
// import { SectionTab } from 'polotno/side-panel';
// import MdPhotoLibrary from '@meronex/icons/md/MdPhotoLibrary';

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { generateImage } from "../../../utils/pngGenerator";
import { json } from "../../../data";
import { useDispatch, useSelector } from "react-redux";
// dummy store slice for img grid
import { addId } from "store/slices/templateSlice";


export const TemplatesPanel = observer(({ store }) => {
  const templates = useSelector((state) => state.templates.templates);
  const templatesId = useSelector((state) => state.templates.templateId);

const dispatch = useDispatch()
  const [customTemplates, SetCustomTemplates] = useState([]);

  const getTemplate = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://car.develop.somomarketingtech.com/api/template"
      );
      // const data = {};
      // const prev = store.toDataURL(data);
      // SetCustomTemplates((prev) => [...prev, { json: res, prev: prev }]);
      const fetchedData=res?.data?.result?.templates?.data;
      console.log(fetchedData,'FETCHED DATA')
      for(let i=0;i<fetchedData.length;i++){
        SetCustomTemplates(prev => [...prev,{
          json:fetchedData[i]?.settings,
          prev:fetchedData[i]?.medias[0].media_url,
          id:fetchedData[i]?.id
        }])
      }
      console.log(customTemplates,'CUSTOM ARRAY')
      // console.log(JSON.parse(res?.data?.result?.templates?.data[0]?.settings), "---------")
      // SetJsonTemplates(res?.data?.result?.templates?.data);
      // SetCustomTemplates(jsonTemplates[0].settings)
      //   console.log(customTemplates,'CUSTOM TEMPLATES 1')

      // for(let i=0;i<jsonTemplates.length;i++){
      //   SetCustomTemplates(jsonTemplates[i].settings)
      //   console.log(customTemplates)
      // }
    } catch (error) {
      console.log("error in API", error.message);
    }
  },[]) 
  useEffect(() => {
    getTemplate();
  }, [templatesId]);

 
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
        images={customTemplates?.map((data) => data.prev).flat()}
        getPreview={(item) => {
          // console.log(objectArray[0].prev)

          const obj = customTemplates?.find((it) => it.prev === item);
          // console.log(item)
          // console.log(obj.prev,'PREVIEW')
          // setLoading(true)
          store.waitLoading()
          return obj?.prev;
        }}
        // isLoading={loading}
        onSelect={async (item) => {
          // setLoading(true)
          const obj = customTemplates?.find((it) => it.prev === item);
          // console.log(item===obj.prev)
          store.waitLoading()
          await store.loadJSON(await JSON.parse(obj?.json));
          dispatch(addId(obj?.id))
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
