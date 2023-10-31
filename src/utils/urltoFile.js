export const urltoFile = async (url, filename, mimeType) => {
    const response = await fetch(url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return new File([blob], filename, { type: mimeType });
      });
    return response;
  };