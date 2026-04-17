// import { useAuth } from "@clerk/clerk-expo";
// import axios from "axios";
// import { useEffect } from "react";
// import * as Sentry from "@sentry/react-native";

// const API_URL = "https://real-time-x-react-native-chat-app.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// export const useApi = () => {
//   const { getToken } = useAuth();
//   useEffect(() => {
//     const requestInterceptor = api.interceptors.request.use(async (config) => {
//       const token = await getToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     });
//     const responseInterceptor = api.interceptors.response.use(
//       (res) => res,
//       (error) => {
//         // log the error in sentry
//         if (error.response) {
//           Sentry.logger.error(
//             Sentry.logger
//               .fmt`Api request failed:${error.config?.method?.toUpperCase()}`,
//             {
//               status: error.response.status,
//               endpoint: error.config?.url,
//               method: error.config?.method,
//             },
//           );
//         } else if (error.request) {
//           Sentry.logger.warn(
//             Sentry.logger.fmt`Api request failed - no response`,
//             {
//               endpoint: error.config?.url,
//               method: error.config?.method,
//             },
//           );
//         }
//         return Promise.reject(error);
//       },
//     );
//     return () => {
//       api.interceptors.request.eject(requestInterceptor);
//       api.interceptors.request.eject(responseInterceptor);
//     };
//   }, [getToken]);
//   return api;
// };

import axios from "axios";
import * as Sentry from "@sentry/react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
const API_URL = "http://15.206.116.127:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor registered once
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      Sentry.logger.error(
        Sentry.logger
          .fmt`API request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          status: error.response.status,
          endpoint: error.config?.url,
          method: error.config?.method,
        },
      );
    } else if (error.request) {
      Sentry.logger.warn("API request failed - no response", {
        endpoint: error.config?.url,
        method: error.config?.method,
      });
    }
    return Promise.reject(error);
  },
);

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T>(config: Parameters<typeof api.request>[0]) => {
      const token = await getToken();
      return api.request<T>({
        ...config,
        headers: {
          ...config.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    },
    [getToken],
  );

  return { api, apiWithAuth };
};
