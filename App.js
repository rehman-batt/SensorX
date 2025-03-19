import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { foregroundColor1, buttonForeground, backgroundColor } from './styles/SensorStyles';
// import { Pressable } from 'react-native';
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
// import Icon from 'react-native-vector-icons/Entypo';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './config/firebase';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    })
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, [])
  
  if (loading)
  {
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundColor }}>
        <ActivityIndicator color={foregroundColor1} size={60} />
      </View>
  }
  else if (user) {
    return (
      
      <>
        {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sensors" component={Home} options={{
            headerLeft: () => (
              <Pressable onPress={() => alert('Hello')} style={{ marginRight: '7%', marginTop: '2%', marginLeft: '-5%' }}>
                <Icon name="menu" size={30} color={buttonForeground} />
              </Pressable>
            ),
            headerStyle: {
              backgroundColor: foregroundColor1,
            },
            headerTintColor: buttonForeground,
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}

        <StatusBar backgroundColor={foregroundColor1} barStyle={'light-content'} />
        <NavigationContainer>
          <Drawer.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: foregroundColor1,
            },
            headerTitleStyle: {
              color: buttonForeground,
            },
            headerTintColor: buttonForeground,
          }}>
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

    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LogIn" component={Login} />
          <Stack.Screen name="SignUp" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

