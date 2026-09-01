export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Compatibility shim for template components that are not part of pipeline's
 * public UI. Pipeline intentionally has no sign-in or external auth flow.
 */
export const startLogin = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pipeline-auth-unavailable"));
  }
};
