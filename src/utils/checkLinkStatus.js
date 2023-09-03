import axios from "axios";

export default async function checkLinkStatus(link) {
  try {
    const response = await axios.head(link);
    const status = response.status;

    return status === 200;
  } catch (e) {
    return false;
  }
}
