import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Chat, User } from "@/types";
import UserItem from "@/components/UserItem";
import { useGetOrCreateChats } from "@/hooks/useChats";
import { useUsers } from "@/hooks/useUsers";
import { useSocketStore } from "@/lib/socket";

const NewChatScreen = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const { data: allUsers, isLoading } = useUsers();
  // const debouceRef = useRef<any>(null);
  const { mutate, isPending: isCreatingChat } = useGetOrCreateChats();
  const { onlineUsers } = useSocketStore();
  const users = allUsers?.filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });


// todo 

  // const handleSearch = () => {
  //   if (debouceRef.current) {
  //     clearTimeout(debouceRef);
  //   }
  //   debouceRef.current = setTimeout(() => {
      
  //   }, 2000);
  // };

  const handleUserSelect = (user: User) => {
    mutate(user._id, {
      onSuccess: (chat) => {
        router.dismiss();
        setTimeout(() => {
          router.push({
            pathname: "/chat/[id]",
            params: {
              id: chat._id,
              participant: chat.participant._id,
              name: chat.participant.name,
              avatar: chat.participant.avatar,
            },
          });
        }, 100);
      },
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-surface rounded-t-3xl h-[95%] overflow-hidden">
          <View className="px-5 pt-3 pb-3 bg-surface border-b border-surface-light flex-row items-center">
            <Pressable
              className="w-9 h-9 rounded-full items-center justify-center mr-2 bg-surface-card"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color={"#6B6B70"} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-foreground text-xl font-semibold">
                New Chat
              </Text>
              <Text className="text-muted-foreground text-xs mt-0.5">
                Search for a user to start chatting
              </Text>
            </View>
          </View>

          {/* search bar  */}
          <View className="px-5 pt-3 pb-2 bg-surface">
            <View className="flex-row items-center bg-surface-card rounded-full px-3 py-1.5 gap-2 border border-surface-light">
              <Ionicons name="search" size={18} color={"#6B6B70"} />
              <TextInput
                className="flex-1 text-foreground text-sm"
                placeholder="Search Users with Name of Email"
                placeholderTextColor={"#6B6B70"}
                value={searchQuery}
                onChangeText={setsearchQuery}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* users list  */}
          <View className="flex-1 bg-surface">
            {isCreatingChat || isLoading ? (
              <View className="flex-1 items-center">
                <ActivityIndicator size={"large"} color={"#8B5CF6"} />
              </View>
            ) : !users || users.length === 0 ? (
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons name="person-outline" size={64} color="#6B6B70" />

                <Text className="text-muted-foreground text-lg mt-4">
                  No users found
                </Text>

                <Text className="text-subtle-foreground text-sm mt-1 text-center">
                  Try a different search term
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <Text className="text-muted-foreground text-xs mb-3">
                  Users
                </Text>
                {users.map((user) => (
                  <UserItem
                    key={user._id}
                    user={user}
                    isOnline={onlineUsers.has(user._id)}
                    onPress={() => handleUserSelect(user)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen;
