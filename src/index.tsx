import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import GlobalStyle from 'styles/globalStyles';
import { AppContextProvider } from 'context';

import { App } from './App';

import './shared/fonts/FontAwesome/css/all.min.css';
import './styles/antStyles.css';
import './index.css';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 10 * 60 * 1000, // 10 minutes
		},
	},
});

class Root extends React.Component {
	render() {
		return (
			<AppContextProvider>
				<QueryClientProvider client={queryClient}>
					<GlobalStyle />
					<App />
				</QueryClientProvider>
			</AppContextProvider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));
