import { useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAccessTokenProvider } from "../lib/api";
import { useAppDispatch } from "../store/hooks";
import { clearUserState, loadMe } from "../store/userSlice";

const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

export function AuthBootstrap() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const dispatch = useAppDispatch();

  const tokenProvider = useMemo(
    () => async () => {
      if (!auth0Audience) {
        const claims = await getIdTokenClaims();
        if (!claims?.__raw) {
          throw new Error("Unable to obtain ID token");
        }
        return claims.__raw;
      }

      const tokenOptions = {
        authorizationParams: { audience: auth0Audience },
      };

      try {
        return await getAccessTokenSilently(tokenOptions);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error ?? "");
        const shouldFallback = message.includes("Missing Refresh Token");

        if (!shouldFallback) {
          throw error;
        }

        return getAccessTokenSilently({
          ...tokenOptions,
          cacheMode: "off",
        });
      }
    },
    [getAccessTokenSilently, getIdTokenClaims],
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      setAccessTokenProvider(null);
      dispatch(clearUserState());
      return;
    }

    setAccessTokenProvider(tokenProvider);
    dispatch(loadMe());
  }, [dispatch, isAuthenticated, isLoading, tokenProvider]);

  return null;
}
