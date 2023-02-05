import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useTheme } from 'styles';
import GlobalStyle from 'styles/globalStyles';
import { AppContextProvider } from 'context';

import { App } from './App';

import './index.css';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

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
