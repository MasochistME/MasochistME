import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Modal from 'react-modal';

import GlobalStyle from 'styles/globalStyles';
import store from 'shared/store/store';
import { AppContextProvider } from 'shared/store/context';

import { App } from './App';

import './shared/fonts/FontAwesome/css/all.css';
import './styles/antStyles.css';
import './index.css';

Modal.setAppElement('#root');

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
					<Provider store={store}>
						<GlobalStyle />
						<App />
					</Provider>
				</QueryClientProvider>
			</AppContextProvider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));
