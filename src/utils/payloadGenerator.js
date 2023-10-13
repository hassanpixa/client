// import { async } from "q";
const payload = new FormData();
let json = {};
// file generator
const urltoFile = async (url, filename, mimeType) => {
    // Implement the function to convert a URL to a file and return it.
    // This implementation can vary depending on your project's requirements.
    // For example, you might use the Fetch API to download the URL content and create a Blob.

    // Example:
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
};


export const payloadHandler = async (store) => {
    
        for(let item of payload){
            payload?.delete(item)
        }
        json = JSON.stringify(await store.toJSON());
        payload.append("json", json);
        const data = new Date();
        //  // mobile
        store.setSize(1600, 720, true);
        const mobileUrl = await store.toDataURL({ mimeType: "image/jpg" });
        const file1 = await urltoFile(
            mobileUrl,
            data.getTime() + ".jpg",
            "image/jpeg"
        );
        payload.append("mobile", file1);
        // tab
        store.setSize(1280, 800, true);

        const tabUrl = await store.toDataURL({ mimeType: "image/jpg" });
        const file2 = await urltoFile(
            tabUrl,
            data.getTime() + ".jpg",
            "image/jpeg"
        );
        payload.append("tab", file2);
        //  payload.push({
        //   tabUrl:file3
        // });

        //  payload.push({
        //   mobileUrl:file3
        // });
        // tv file
        store.setSize(1280, 720, true);
        const tvUrl = await store.toDataURL({ mimeType: "image/jpg" });
        const file3 = await urltoFile(tvUrl, data.getTime() + ".jpg", "image/jpeg");
        payload.append("tv", file3);
        return payload;
   

}