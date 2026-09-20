import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/HomeScreen';
import { WallCoveringScreen } from './screens/WallCoveringScreen';
import { ShowerSurroundsScreen } from './screens/ShowerSurroundsScreen';
import { DigitallyPrintedWCScreen } from './screens/DigitallyPrintedWCScreen';
import { ComingSoonScreen } from './screens/ComingSoonScreen';

export type RootStackParamList = {
  Home: undefined;
  WallCovering: undefined;
  ShowerSurrounds: undefined;
  DigitalWC: undefined;
  ComingSoon: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WallCovering" component={WallCoveringScreen} />
        <Stack.Screen name="DigitalWC" component={DigitallyPrintedWCScreen} />
        <Stack.Screen name="ShowerSurrounds" component={ShowerSurroundsScreen} />
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
