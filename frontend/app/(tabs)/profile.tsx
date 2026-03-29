import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <ScrollView
      className="bg-surface"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text className="text-white">Profile</Text>
      <Pressable
        className="mt-40 bg-red-600 px-4 py-2"
        onPress={() => signOut()}
      >
        <Text> Sign out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;
