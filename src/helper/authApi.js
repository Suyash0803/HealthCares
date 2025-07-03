import axios from 'axios';

const fetchData = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const config = {
    method: method,
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body && { data: body }), // Only include 'data' if body is provided
  };

  const { data } = await axios(config);
  return data;
};

export default fetchData;
