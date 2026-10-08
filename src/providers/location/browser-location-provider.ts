import { LocationError, type LocationProvider, type UserLocation } from "./types";

export class BrowserLocationProvider implements LocationProvider {
  async isAlreadyGranted(): Promise<boolean> {
    try {
      const status = await navigator.permissions?.query({ name: "geolocation" });
      return status?.state === "granted";
    } catch {
      return false;
    }
  }

  getCurrentLocation(): Promise<UserLocation> {
    if (!("geolocation" in navigator)) {
      return Promise.reject(new LocationError("unavailable", "This browser doesn't support location."));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy }),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) reject(new LocationError("denied", "Location permission was denied."));
          else if (err.code === err.POSITION_UNAVAILABLE) reject(new LocationError("unavailable", "Your position is unavailable."));
          else if (err.code === err.TIMEOUT) reject(new LocationError("error", "Finding your location took too long."));
          else reject(new LocationError("error", err.message || "Couldn't get your location."));
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
      );
    });
  }
}
