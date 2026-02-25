import { useAuthCallback } from "@/hooks/useAuth";
import { useApi } from "@/lib/axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSynced = useRef(false);
  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      const api = useApi();
      axios.get(`${api}/health`).then((e) => {
        console.log(e.data);
      });
      hasSynced.current = true;
      syncUser(undefined, {
        onSuccess: (data) => {
          Alert.alert("user synced with backend", data.name);
        },
        onError: (error) => {
          Alert.alert(`error while syncing db ${error}`);
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
