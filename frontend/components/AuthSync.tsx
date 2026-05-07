import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

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
        },
        onError: (error) => {
          Alert.alert("User sync with backend failed");
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
