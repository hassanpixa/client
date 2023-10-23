import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
// import { useInfiniteAPI } from "polotno/utils/use-api";
// import { Jsondata } from "../../../data";
import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";
import axios from "api/axios";
// import { SectionTab } from 'polotno/side-panel';
// import MdPhotoLibrary from '@meronex/icons/md/MdPhotoLibrary';
import Swal from "sweetalert2";
import { ImagesGrid } from "polotno/side-panel/images-grid";
// import { generateImage } from "../../../utils/pngGenerator";
// import { json } from "../../../data";
import { useDispatch } from "react-redux";
// dummy store slice for img grid
import { addId } from "store/slices/templateSlice";

export const TemplatesPanel = observer(({ store }) => {
  // const templates = useSelector((state) => state.templates.templates);
  // const templatesId = useSelector((state) => state.templates.templateId);

  const dispatch = useDispatch();
  const [customTemplates, SetCustomTemplates] = useState([]);
  const [templateId, SetTemplateId] = useState();
  const [loading, setLoading] = useState(true);
  const [deleted, SetDeleted] = useState(false);
  const [deletePopUp, SetDeletePopUp] = useState(false);

  const getTemplate = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://car.develop.somomarketingtech.com/api/template"
      );
      const fetchedData = res?.data?.result?.templates?.data;
      console.log(fetchedData, "FETCHED DATA");
      for (let i = 0; i < fetchedData.length; i++) {
        SetCustomTemplates((prev) => [
          ...prev,
          {
            json: fetchedData[i]?.settings,
            prev: fetchedData[i]?.medias[0]?.media_url,
            id: fetchedData[i]?.id,
          },
        ]);
      }
      console.log(customTemplates, "CUSTOM ARRAY");
      setLoading(false);
    } catch (error) {
      console.log("error in API", error.message);
    }
  }, [customTemplates]);

  const deleteHandler = async (templateId) => {
    try {
      // Send a DELETE request using Axios
      const res = await axios.delete(
        `https://car.develop.somomarketingtech.com/api/template/${templateId}`
      );
      // Handle success or perform any additional actions
      console.log("Delete request successful");
      return res.status;
    } catch (error) {
      // Handle errors
      console.error("Error while making the DELETE request:", error);
    }
  };

  if (deletePopUp) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const status = await deleteHandler(templateId);
        if (status === 200) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          SetTemplateId(null);
          SetDeleted(true);
          dispatch(addId(null));
        } else {
          Swal.fire("Failed", "Your file is Not Deleted.", "Fail");
        }
        SetDeletePopUp(false);
      }
    });
  }

  useEffect(() => {
    getTemplate();
    // eslint-disable-next-line
  }, [deleted]);

  // const { data, isLoading } = useInfiniteAPI({
  //   fetchFunc: getTemplate,
  // });
  // console.log(data,'data from Infinite API')
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
    <>
      {templateId && (
        <button onClick={() => SetDeletePopUp(true)}>
          Delete Selected Custom Template
        </button>
      )}
      <div style={{ height: "100%" }}>
        <ImagesGrid
          shadowEnabled={false}
          images={customTemplates?.map((data) => data.prev).flat()}
          getPreview={(item) => {
            const obj = customTemplates?.find((it) => it.prev === item);
            store.waitLoading();
            return obj?.prev;
          }}
          isLoading={loading}
          onSelect={async (item) => {
            const obj = customTemplates?.find((it) => it.prev === item);
            store.waitLoading();
            await store.loadJSON(await JSON.parse(obj?.json));
            SetTemplateId(obj?.id);
          }}
          rowsNumber={1}
        />
      </div>
    </>
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
