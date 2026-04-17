import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "@/hooks/useSocialAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedOrb from "@/components/AnimatedOrb";
import { BlurView } from "expo-blur";

const { height, width } = Dimensions.get("window");

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#0D0D0F", "#1A1A2E", "#4C1D95", "#0D0D0F"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />  
        {/* <AnimatedOrb
          colors={["#a855f7", "#7e22ce"]}
          duration={4000}
          size={300}
          initialX={-80}
          initialY={height * 0.1}
        />

        <AnimatedOrb
          colors={["#a855f7", "#7e22ce"]}
          duration={5000}
          size={250}
          initialX={width - 100}
          initialY={height * 0.3}
        />
        <AnimatedOrb
          colors={["#a855f7", "#7e22ce"]}
          duration={3500}
          size={200}
          initialX={width * 0.3}
          initialY={height * 0.6}
        /> */}
        {/* <BlurView
          intensity={70}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        /> */}
      </View>
      <SafeAreaView className="flex-1">
        <View className="items-center pt-10">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="text-4xl font-bold text-[#7e22ce] font-serif tracking-wider">
            Real Time X
          </Text>
        </View>
        {/* center section */}
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("../../assets/images/auth2.png")}
            style={{ width: width - 48, height: height * 0.3 }}
            contentFit="contain"
          />

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Connect and Chat
            </Text>
            <Text className="text-3xl font-bold text-primary font-mono">
              Seamlessly
            </Text>
          </View>

          <View className="flex-row gap-4 mt-10">
            {/* google button  */}
            <Pressable
              onPress={() => handleSocialAuth("oauth_google")}
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
              disabled={loadingStrategy !== null}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size={"small"} color={"#1a1a1a"} />
              ) : (
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              )}
              <Text className="text-gray-900 font-semibold text-lg">
                Google
              </Text>
            </Pressable>

            {/* apple button  */}
            {Platform.OS === "ios" && (
              <Pressable
                onPress={() => handleSocialAuth("oauth_apple")}
                className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl active:scale-[0.97]"
                disabled={loadingStrategy !== null}
              >
                {loadingStrategy === "oauth_apple" ? (
                  <ActivityIndicator size={"small"} color={"#1a1a1a"} />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                    <Text className="text-foreground font-semibold text-lg">
                      Apple
                    </Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
