import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import * as Sentry from "@sentry/react-native";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSynced = useRef(false);
  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true;
      syncUser(undefined, {
        onSuccess: (data) => {
          Alert.alert("user synced with backend", data.name);
          Sentry.logger.info(
            Sentry.logger.fmt`User synced with backend:${data.name}`,
            { userId: user.id, userName: data.name },
          );
        },
        onError: (error) => {
          Alert.alert(`error while syncing db ${error}`);
          Sentry.logger.error("failed to sync user with backend", {
            userId: user.id,
            error: error instanceof Error ? error.message : String(error),
          });
        },
      });
    }
    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isSignedIn, user, syncUser]);

  return null;
};

export default AuthSync;
