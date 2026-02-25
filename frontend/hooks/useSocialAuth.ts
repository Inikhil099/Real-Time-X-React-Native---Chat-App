import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
  const [loadingStrategy, setloadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) {
      return;
    }
    setloadingStrategy(strategy);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: "exp://872mvdk-anonymous-8081.exp.direct",
      });

      if (!createdSessionId || !setActive) {
        Alert.alert("Sign is not compeleted. Try Again from use social auth");
        return;
      }
      await setActive({ session: createdSessionId });
    } catch (error) {
      console.log("Error in social auth");
      Alert.alert(
        `Error \nFailed to sign in with ${strategy === "oauth_google" ? "Google" : "Apple"}. Please try again`,
      );
    } finally {
      setloadingStrategy(null);
    }
  };
  return {
    handleSocialAuth,
    loadingStrategy,
  };
}

export default useAuthSocial;
