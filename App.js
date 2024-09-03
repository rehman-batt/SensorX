import 'react-native-gesture-handler';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { foregroundColor1, buttonForeground } from './styles/SensorStyles';
// import { Pressable } from 'react-native';
import Home from './screens/Home';
import UC from './screens/UnderConstruction';
// import MapScreen from './screens/Map'
// import Icon from 'react-native-vector-icons/Entypo';


// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
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
          <Drawer.Screen name="Dashboard" component={UC} />
          <Drawer.Screen name="Settings" component={UC} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  )
}

