import { useApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { Chat } from "@/types";

export const useChats = () => {
  const { apiWithAuth } = useApi();
  return useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      const { data } = await apiWithAuth<Chat[]>({
        method: "GET",
        url: "/chat",
      });
      return data;
    },
  });
};
