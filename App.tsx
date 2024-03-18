import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from './src/navigation';
import { Provider } from 'react-redux';
import { createStore ,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import store from './src/Redux/store'

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
