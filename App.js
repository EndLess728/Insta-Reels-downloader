import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Home from './src/screens/Home/index';
import {globalStyles} from './src/constants';

const App = () => {
  return (
    <View style={{flex: 1, backgroundColor: globalStyles.LIGHT_BG}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <StatusBar barStyle="light-content" />
        <Home />
      </ScrollView>
    </View>
  );
};

export default App;
