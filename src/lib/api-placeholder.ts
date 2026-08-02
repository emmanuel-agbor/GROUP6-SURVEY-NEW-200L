/**
 * Placeholder for data that will arrive from the Spring Boot API.
 * Returns `undefined` (loading) so every screen renders its real
 * loading/empty/error states until the endpoints are wired up.
 */
export function pendingResource<T>(): T | undefined {
  return undefined;
}

/** Placeholder for a collection endpoint that has not been wired up yet. */
export function pendingCollection<T>(): T[] {
  return [];
}