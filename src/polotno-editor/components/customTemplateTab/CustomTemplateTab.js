import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
// import { useInfiniteAPI } from "polotno/utils/use-api";
// import { Jsondata } from "../../../data";
import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";
import axios from "api/axios";
import Endpoints from "api/Endpoints";
// import { SectionTab } from 'polotno/side-panel';
// import MdPhotoLibrary from '@meronex/icons/md/MdPhotoLibrary';
import Swal from "sweetalert2";
import { ImagesGrid } from "polotno/side-panel/images-grid";
// import { generateImage } from "../../../utils/pngGenerator";
// import { json } from "../../../data";
import { useDispatch, useSelector } from "react-redux";
// dummy store slice for img grid
import { addId } from "store/slices/templateSlice";
import {
  addTemplates,
  //  removeTemplates
} from "store/slices/templateSlice";
export const TemplatesPanel = observer(({ store }) => {
  const templates = useSelector((state) => state.templates.templates);
  // const templatesId = useSelector((state) => state.templates.templateId);

  const dispatch = useDispatch();
  // const [customTemplates, SetCustomTemplates] = useState([]);
  // const [templateId, SetTemplateId] = useState();
  const [loading, setLoading] = useState(true);

  // const getTemplate = useCallback(async () => {
  //   try {
  //     const res = await axios.get(
  //       "https://car.develop.somomarketingtech.com/api/template"
  //     );
  //     const fetchedData = res?.data?.result?.templates?.data;
  //     console.log(fetchedData, "FETCHED DATA");
  //     for (let i = 0; i < fetchedData.length; i++) {
  //       SetCustomTemplates((prev) => [
  //         ...prev,
  //         {
  //           json: fetchedData[i]?.settings,
  //           prev: fetchedData[i]?.medias[0]?.media_url,
  //           id: fetchedData[i]?.id,
  //         },
  //       ]);
  //     }
  //     console.log(customTemplates, "CUSTOM ARRAY");
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("error in API", error.message);
  //   }
  // }, [customTemplates]);
  const getTemplate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(Endpoints.template);
      const fetchedData = res?.data?.result?.templates?.data;
      // console.log(fetchedData, "FETCHED DATA");
      for (let i = 0; i < fetchedData.length; i++) {
        // SetCustomTemplates((prev) => [
        //   ...prev,
        //   {
        //     json: fetchedData[i]?.settings,
        //     prev: fetchedData[i]?.medias[0]?.media_url,
        //     id: fetchedData[i]?.id,
        //   },
        // ]);
        dispatch(
          addTemplates({
            json: fetchedData[i]?.settings,
            prev: fetchedData[i]?.medias[0]?.media_url,
            id: fetchedData[i]?.id,
          })
        );
      }
      setLoading(false);
    } catch (error) {
      // console.log("error in API", error.message);
      Swal.fire("Error!", error.message, "Fail");
    }
  };

  // const deleteHandler = async () => {
  //   try {
  //     // Send a DELETE request using Axios
  //     const res = await axios.delete(
  //       `${Endpoints.template}/${templateId}`
  //     );
  //     // Handle success or perform any additional actions
  //     // console.log("Delete request", res);
  //     return res.status;
  //   } catch (error) {
  //     // Handle errors
  //     Swal.fire("Error!",error.message, "Fail");
  //     // console.error("Error while making the DELETE request:", error.message);
  //   }
  // };

  // const handleDeleteClick = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const status = await deleteHandler();
  //       if (status === 200) {
  //         // console.log(status, "delete status");
  //         Swal.fire("Deleted!", "Your file has been deleted.", "success");
  //         dispatch(removeTemplates(templateId));
  //         store.clear();
  //         SetTemplateId(null);
  //       } else {
  //         Swal.fire("Failed", "Your file is Not Deleted.", "Fail");
  //       }
  //     }
  //   });
  // };

  useEffect(() => {
    getTemplate();
    return () => {
      dispatch(addId(null));
    };
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div style={{ height: "100%" }}>
        {/* {templateId && (
        <button
        className="delete_button"
          onClick={() => {
            handleDeleteClick();
          }}
        >
          Delete
        </button>
      )} */}
        <ImagesGrid
          shadowEnabled={false}
          images={templates?.map((data) => data.prev).flat()}
          getPreview={(item) => {
            const obj = templates?.find((it) => it.prev === item);
            store.waitLoading();
            return obj?.prev;
          }}
          isLoading={loading}
          onSelect={async (item) => {
            const obj = templates?.find((it) => it.prev === item);
            // console.log("on select", obj.json);
            store.waitLoading();
            await store.loadJSON(await JSON.parse(obj?.json));
            // SetTemplateId(obj?.id);
            dispatch(addId(obj?.id));
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
