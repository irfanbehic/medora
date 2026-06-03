import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      retry: 2,
      retryDelay: 400,
      staleTime: 60_000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export function bindOnlineManager(): void {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    }),
  );
}
