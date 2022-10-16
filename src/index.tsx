import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import App from './App';
import GlobalStyle from 'shared/styles/globalStyles';
import AppContextProvider from 'shared/store/context';
import store from 'shared/store/store';

import './fonts/FontAwesome/css/all.css';
import './shared/styles/antStyles.css';
import './index.css';

const queryClient = new QueryClient();

class Root extends React.Component {
	render() {
		return (
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<GlobalStyle />
					<AppContextProvider>
						<App />
					</AppContextProvider>
				</Provider>
			</QueryClientProvider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));
