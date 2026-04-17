import { useApi } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Chat } from "@/types";

export const useChats = () => {
  const { apiWithAuth } = useApi();
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await apiWithAuth<Chat[]>({
        method: "GET",
        url: "/chat",
      });
      return data;
    },
  });
};

export const useGetOrCreateChats = () => {
  const { apiWithAuth } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (participatntId: string) => {
      const { data } = await apiWithAuth<Chat>({
        method: "POST",
        url: `/chat/with/${participatntId}`,
      });
      return data;
    },
    onSuccess: (d) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
