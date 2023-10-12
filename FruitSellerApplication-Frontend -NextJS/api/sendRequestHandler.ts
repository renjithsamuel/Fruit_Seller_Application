import axios from "axios";

export const sendHttpRequest = async (
  url: string,
  method: string,
  token: string | null,
  data: object | null
): Promise<any> => {
  let returnData: any;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `${token}`;
  }
  try {
    const response = await axios({
      url,
      method,
      data,
      headers,
    });

    returnData = response.data;
  } catch (err) {
    console.error(JSON.stringify(err));
  }
  return returnData;
};











