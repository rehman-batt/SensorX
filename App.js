import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { foregroundColor1, buttonForeground } from './styles/SensorStyles';
import { Pressable } from 'react-native';
import Home from './screens/Home';
import MapScreen from './screens/Map'
import Icon from 'react-native-vector-icons/Entypo';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Sensors" component={Home} options={{
          headerLeft: () => (
            <Pressable onPress={() => alert('Hello')} style={{marginRight: '7%', marginTop: '2%', marginLeft: '-5%'}}>
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
    </NavigationContainer>
  )
}

