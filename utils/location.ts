import axios from "axios";
import { FormattedAddress, ReverseGeocodeResponse } from "./types";

const getAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<FormattedAddress | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await axios.get<ReverseGeocodeResponse>(url, {
      headers: {
        "User-Agent": "your-app-name",
      },
    });

    const { address, display_name } = res.data;
    return {
      fullAddress: display_name,
      street: address.road || "",
      city: address.city || address.town || address.village || "",
      country: address.country || "",
      postalCode: address.postcode || "",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching address:", error.message);
    } else {
      console.error("Unknown error fetching address");
    }
    return null;
  }
};

export { getAddressFromCoords };
