import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/css/index.css';
import './fonts/FontAwesome/css/all.css';
import App from './components/App';
import store from 'shared/store/store';

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
