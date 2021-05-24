import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import GlobalStyle from 'shared/globalStyles';
import AppContextProvider from 'shared/store/context';
import store from 'shared/store/store';

import './fonts/FontAwesome/css/all.css';
import 'antd/dist/antd.css';
import './index.css';

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
