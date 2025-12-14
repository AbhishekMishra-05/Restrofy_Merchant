export const uploadImageToR2 = async (localUri) => {
  try {
    const fileName = localUri.split("/").pop() || "upload.jpg";
    const formData = new FormData();
    formData.append("file", {
      uri: localUri,
      type: "image/jpeg",
      name: fileName,
    });

    const res = await fetch("https://foodo-server.onrender.com/api/upload", {
      method: "POST",
      body: formData,
      // ❌ Don't set "Content-Type" manually
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${text}`);
    }

    const data = await res.json();
    console.log("✅ Uploaded:", data.url);
    return data.url;
  } catch (err) {
    console.error("❌ Upload error:", err);
    return null;
  }
};
