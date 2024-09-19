// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Slider from '@react-native-community/slider';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { AuthStyles, placeholderTextColor } from '../styles/AuthStyles';
// import { carNames } from '../data/Cars';
// import { foregroundColor1, foregroundColor2 } from '../styles/SensorStyles';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';


// export default function Signup({ navigation }) {
//   const [selectedCar, setSelectedCar] = useState(carNames[0]);
//   const [makeYear, setMakeYear] = useState(new Date().getFullYear());
//   const [condition, setCondition] = useState(5);

//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const auth = FIREBASE_AUTH;

//   const validateInput = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       Alert.alert('Validation Error', 'Please enter your email.');
//       return false;
//     } else if (!emailRegex.test(email)) {
//       Alert.alert('Validation Error', 'Please enter a valid email address.');
//       return false;
//     }

//     if (!password) {
//       Alert.alert('Validation Error', 'Please enter your password.');
//       return false;
//     } else if (password.length < 6) {
//       Alert.alert('Validation Error', 'Password should be at least 6 characters long.');
//       return false;
//     }

//     return true;
//   };

//   const signup = async () => {
//     if (!validateInput()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('here');
//       const response = await createUserWithEmailAndPassword(auth, email, password);
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//       let errorMessage = 'An error occurred. Please try again.';
//       if (error.code === 'auth/weak-password') {
//         errorMessage = 'Password should be at least 6 characters long.';
//       } else if (error.code === 'auth/invalid-email') {
//         errorMessage = 'Please enter a valid email address.';
//       } else if (error.code === 'auth/wrong-password') {
//         errorMessage = 'Incorrect password. Please try again.';
//       } else if (error.code === 'auth/user-not-found') {
//         errorMessage = 'This user does not exist.';
//       } else if (error.code === 'auth/user-disabled') {
//         errorMessage = 'Contact Admin. Your account had been suspended.';
//       } else if (error.code === 'auth/invalid-credential') {
//         errorMessage = 'The entered credentials are invalid.';
//       } else if (error.code === 'auth/email-already-in-use') {
//         errorMessage = 'An account is already registered for this email address.';
//       } else if (error.code === 'auth/credential-already-in-use') {
//         errorMessage = 'The entered credentials are already in use by another account.';
//       }

//       Alert.alert('Sign Up Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }


//   const currentYear = new Date().getFullYear();
//   const years = Array.from(new Array(currentYear - 1950 + 1), (val, index) => 1950 + index);

//   return (
//     <ScrollView contentContainerStyle={AuthStyles.container}>
//       <View style={AuthStyles.iconContainer}>
//         <Icon name="person-add" size={60} color={foregroundColor1} />
//       </View>

//       <TextInput
//         style={AuthStyles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         placeholderTextColor={placeholderTextColor}
//         value={email}
//         onChangeText={(e) => setEmail(e)}
//       />
//       <TextInput
//         style={AuthStyles.input}
//         placeholder="Password"
//         secureTextEntry
//         placeholderTextColor={placeholderTextColor}
//         value={password}
//         onChange={(p) => setPassword(p)}
//       />


//       <View style={AuthStyles.pickerContainer}>
//         <Picker
//           selectedValue={selectedCar}
//           style={AuthStyles.picker}
//           onValueChange={(itemValue) => setSelectedCar(itemValue)}
//         >
//           {carNames.map((car, index) => (
//             <Picker.Item key={index} label={car} value={car.toLowerCase().replace(/\s+/g, '')} />
//           ))}
//         </Picker>
//       </View>

//       <View style={AuthStyles.pickerContainer}>
//         <Picker
//           selectedValue={makeYear}
//           style={AuthStyles.picker}
//           onValueChange={(itemValue) => setMakeYear(itemValue)}
//         >
//           {years.map((year, index) => (
//             <Picker.Item key={index} label={`${year}`} value={year} />
//           ))}
//         </Picker>
//       </View>

//       <View style={AuthStyles.sliderContainer}>
//         <Text style={AuthStyles.sliderLabel}>Condition: {condition}</Text>
//         <Slider
//           style={AuthStyles.slider}
//           minimumValue={0}
//           maximumValue={10}
//           step={0.5}
//           value={condition}
//           onValueChange={(value) => setCondition(value)}
//           minimumTrackTintColor={foregroundColor1}
//           maximumTrackTintColor={foregroundColor2}
//           thumbTintColor={foregroundColor1}
//         />
//       </View>

//       {loading && <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />}

//       {!loading &&
//         <TouchableOpacity style={AuthStyles.button} onPress={signup}>
//           <Text style={AuthStyles.buttonText}>Sign Up</Text>
//         </TouchableOpacity>
//       }
//       {!loading &&
//         <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
//           <Text style={AuthStyles.linkText}>Already have an account? Sign In</Text>
//         </TouchableOpacity>
//       }
//     </ScrollView>

//   );
// };

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStyles } from '../styles/AuthStyles';
import { foregroundColor1, styles } from '../styles/SensorStyles';
import { FIREBASE_AUTH } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH;

    const validateInput = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            Alert.alert('Validation Error', 'Please enter your email.');
            return false;
        } else if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return false;
        }

        if (!password) {
            Alert.alert('Validation Error', 'Please enter your password.');
            return false;
        }

        return true;
    };

    const login = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            console.log(error);
            if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters long.';
              } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
              } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
              } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'This user does not exist.';
              } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'Contact Admin. Your account had been suspended.';
              } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'The entered credentials are invalid.';
              } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account is already registered for this email address.';
              } else if (error.code === 'auth/credential-already-in-use') {
                errorMessage = 'The entered credentials are already in use by another account.';
              }


            Alert.alert('Login Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={AuthStyles.container}>
            <Icon name="person" size={100} color={foregroundColor1} style={AuthStyles.icon} />
            <View style={AuthStyles.inputContainer}>
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                />
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(p) => setPassword(p)}
                />

                {loading && <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />}

                {!loading &&
                    <TouchableOpacity style={AuthStyles.button} onPress={login}>
                        <Text style={AuthStyles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                }

                {/* {!loading &&
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={AuthStyles.linkText}>Don't have an account? Sign Up</Text>
                    </TouchableOpacity>
                } */}
            </View>
        </View>
    );
}
