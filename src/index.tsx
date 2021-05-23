import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import './fonts/FontAwesome/css/all.css';
import App from 'components/App';
import GlobalStyle from 'shared/globalStyles';
import AppContextProvider from 'shared/store/context';
import store from 'shared/store/store';

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <GlobalStyle />
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
