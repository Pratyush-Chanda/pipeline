type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type LocalUser = {
  name?: string | null;
  email?: string | null;
};

function getLocalUser(): LocalUser | null {
  return null;
}

/** Pipeline intentionally has no account or remote authentication layer. */
export function useAuth(_options?: UseAuthOptions) {
  return {
    user: getLocalUser(),
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: async () => undefined,
    logout: async () => undefined,
  };
}
