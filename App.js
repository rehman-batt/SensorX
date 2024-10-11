import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { foregroundColor1, buttonForeground, backgroundColor } from './styles/SensorStyles';
// import { Pressable } from 'react-native';
import Home from './screens/Home';
import UC from './screens/UnderConstruction';
import Settings from './screens/Settings';
import Viz from './screens/Viz';
import Login from './screens/Login';
import Signup from './screens/Signup';
// import MapScreen from './screens/Map'
// import Icon from 'react-native-vector-icons/Entypo';
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './config/firebase';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, SetUser] = useState(null);


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      SetUser(user);
    })
  }, []);
  

  if (user) {
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
            <Drawer.Screen name="Road Condition Map" component={UC} />
            <Drawer.Screen name="Elevation Map" component={UC} />
            <Drawer.Screen name="Data Collection" component={Home} />
            <Drawer.Screen name="Data Visualization" component={Viz} />
            <Drawer.Screen name="Dashboard" component={UC} />
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

