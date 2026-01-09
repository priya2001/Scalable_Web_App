const API_URL = "http://localhost:5000/api";

export const api = async (
  endpoint: string,
  method = "GET",
  body?: any
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
};
