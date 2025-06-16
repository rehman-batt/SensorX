// Import sensor graph components
import AcceleroGraph from '../components/AcceleroGraph';
import GyroGraph from '../components/GyroGraph';
import MagnetoGraph from '../components/MagnetoGraph';
import MagnetoUncGraph from '../components/MagnetoUncGraph';
import MotionAccGraph from '../components/MotionAccGraph';
import MotionAccGravGraph from '../components/MotionAccGravGraph';
import RotationGraph from '../components/RotationGraph';
import RotationRateGraph from '../components/RotationRateGraph';

// Import required modules
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

// Main component rendering the tab-based sensor visualization
export default function Viz() {
    return (
        <Tab.Navigator>

            {/* Accelerometer data visualization */}
            <Tab.Screen
                name="Acceleration Graph"
                component={AcceleroGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/accelerometer-sensor.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#00008B' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Gyroscope data visualization */}
            <Tab.Screen
                name="Gyroscope Graph"
                component={GyroGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/gyroscope-sensor.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Magnetometer data visualization */}
            <Tab.Screen
                name="Magnetometer Graph"
                component={MagnetoGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/magnatometer-sensor.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Uncalibrated magnetometer visualization */}
            <Tab.Screen
                name="Magnetometer Uncalibrated Graph"
                component={MagnetoUncGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/magnatometer-unc-sensor.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Motion acceleration (user movement only) */}
            <Tab.Screen
                name="Motion Acceleration Graph"
                component={MotionAccGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/acceleration.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Motion acceleration with gravity included */}
            <Tab.Screen
                name="Motion Acceleration (Gravity) Graph"
                component={MotionAccGravGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/gravity.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Device rotation visualization */}
            <Tab.Screen
                name="Device Rotation"
                component={RotationGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/rotation.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />

            {/* Rotation rate (angular velocity) visualization */}
            <Tab.Screen
                name="Device Rotation Rate"
                component={RotationRateGraph}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/rotationrate.png')}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#0e4c92' : 'gray'
                            }}
                        />
                    ),
                    tabBarLabel: () => null,
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}
