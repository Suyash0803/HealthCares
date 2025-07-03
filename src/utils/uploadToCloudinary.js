export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // Replace this

  const response = await fetch("https://api.cloudinary.com/v1_1/dgg3mhrz7/image/upload", {
    method: "POST",
    body: formData,
  }); 

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Cloud-hosted image URL
};