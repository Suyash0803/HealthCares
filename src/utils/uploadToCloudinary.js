// src/utils/uploadToCloudinary.js

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", ""); // Replace this

  const response = await fetch("", {
    method: "POST",
    body: formData,
  }); 

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Cloud-hosted image URL
};
