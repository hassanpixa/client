const urltoFile = async (url, filename, mimeType) => {
  const response = await fetch(url)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return new File([blob], filename, { type: blob.type });
    });
  return response;
};

export const mediaGenerator = (polotnoStore,id) => {
  const sizes = [
    { width: 1600, height: 720 }, // mobile
    { width: 1280, height: 720 }, // tab
    { width: 1280, height: 800 }, // tv
  ];
  const keys = ["mobile", "tab", "tv"];
  async function processSizeAndAppendToPayload(width, height, key) {
    // console.log(width, height, key, "DATA");
    const payload = new FormData();
    const data = new Date();
    await polotnoStore.waitLoading();
    polotnoStore.setSize(width, height, true);
    const url = await polotnoStore.toDataURL({ mimeType: "image/jpg" });
    const file = await urltoFile(url, data.getTime() + ".jpg", "image/jpeg");
    // console.log(file, "----------file");
    payload.append("media[]", file);
    payload.append("user_id", "1");
    payload.append("other", "Ads");
    payload.append("device_type", key);
    payload.append("template_id", id);
    
    console.log(payload,'media payload in funtion')
    return payload
  }
  (async () => {
    for (let i = 0; i < sizes.length; i++) {
      await processSizeAndAppendToPayload(
        sizes[i].width,
        sizes[i].height,
        keys[i]
      );
    }
  })();
};
