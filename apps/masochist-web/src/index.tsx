import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { useTheme } from 'styles';
import GlobalStyle from 'styles/globalStyles';
import { initializeLocale } from 'i18n';
import { initializeSentry } from 'initialize/initializeSentry';
import { initializeDayJS } from 'initialize/initializeDayJS';
import { AppContextProvider } from 'context';

import { App } from './App';

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

const RootApp = () => {
  return (
    <AppContextProvider>
      <Root />
    </AppContextProvider>
  );
};

const Root = () => {
  const { assetTokens, colorTokens } = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <GlobalStyle assetTokens={assetTokens} colorTokens={colorTokens} />
      <App />
    </QueryClientProvider>
  );
};

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<RootApp />);
