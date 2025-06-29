import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContextProvider } from 'context';
import { initializeLocale } from 'i18n';
import { initializeDayJS } from 'initialize/initializeDayJS';
import { initializeSentry } from 'initialize/initializeSentry';
import { useTheme } from 'styles';
import GlobalStyle from 'styles/globalStyles';
import { AppRoutes } from './AppRoutes';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

initializeSentry();
initializeDayJS();
initializeLocale();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const App = () => {
  return (
    <AppContextProvider>
      <Providers />
    </AppContextProvider>
  );
};

const Providers = () => {
  const { assetTokens, colorTokens } = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <GlobalStyle assetTokens={assetTokens} colorTokens={colorTokens} />
      <AppRoutes />
    </QueryClientProvider>
  );
};
