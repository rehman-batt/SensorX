// Required imports for gesture support, navigation, and styling
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Custom theme colors
import { foregroundColor1, buttonForeground, backgroundColor } from './styles/SensorStyles';

// Screen components
import Home from './screens/Home';
import UC from './screens/UnderConstruction';
import Recordings from './screens/Recordings';
import Settings from './screens/Settings';
import Viz from './screens/Viz';
import Login from './screens/Login';
import Signup from './screens/Signup';
import MapScreen from './screens/Map';
import Dashboard from './screens/Dashboard';
import ElevationMap from './screens/ElevationMap';

// React Native and Firebase imports
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './config/firebase';

// Create stack and drawer navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  // Track user and loading state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user auth state on app load
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  // Fallback timeout in case Firebase auth check is delayed
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner if app is initializing
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundColor }}>
        <ActivityIndicator color={foregroundColor1} size={60} />
      </View>
    );
  }

  // If user is authenticated, show main drawer-based app
  else if (user) {
    return (
      <>
        <StatusBar backgroundColor={foregroundColor1} barStyle={'light-content'} />
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: foregroundColor1 },
              headerTitleStyle: { color: buttonForeground },
              headerTintColor: buttonForeground,
            }}
          >
            <Drawer.Screen name="Road Condition Map" component={MapScreen} />
            <Drawer.Screen name="Elevation Map" component={ElevationMap} />
            <Drawer.Screen name="Data Collection" component={Home} />
            <Drawer.Screen name="Data Visualization" component={Viz} />
            <Drawer.Screen name="Recordings" component={Recordings} />
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="Settings" component={Settings} />
          </Drawer.Navigator>
        </NavigationContainer>
      </>
    );
  }

  // If user is not authenticated, show login/signup stack
  else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LogIn" component={Login} />
          <Stack.Screen name="SignUp" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
