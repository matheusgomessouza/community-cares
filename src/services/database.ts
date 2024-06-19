import axios from "axios";

export async function getLocations() {
  try {
    const response = await axios.get(
      "https://community-cares-server.onrender.com/locations"
    );
    console.log(response.data);
  } catch (error) {
    console.error("Unable to retrieve Locations data /getLocations", error)
  }
}
