import { User } from "@/types/index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/axios";

export const useUsers = () => {
  console.log("calling");
  const { apiWithAuth } = useApi();
  return useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<User[]> => {
      const { data } = await apiWithAuth<User[]>({
        method: "GET",
        url: "/user/users",
      });
      console.log(data);
      return data;
    },
  });
};

export const useGetOrCreateChats = () => {
  const { apiWithAuth } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (participatntId: string) => {
      const { data } = await apiWithAuth({
        method: "POST",
        url: `/chat/with/${participatntId}`,
      });
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
