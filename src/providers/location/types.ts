export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type LocationErrorKind = "denied" | "unavailable" | "error";

export class LocationError extends Error {
  constructor(
    readonly kind: LocationErrorKind,
    message: string,
  ) {
    super(message);
  }
}

export interface LocationProvider {
  /** Whether permission was already granted earlier, so we can fetch without prompting. */
  isAlreadyGranted(): Promise<boolean>;
  getCurrentLocation(): Promise<UserLocation>;
}
