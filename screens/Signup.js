import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStyles } from '../styles/AuthStyles';
import { foregroundColor1, foregroundColor2 } from '../styles/SensorStyles';
import { FIREBASE_AUTH, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { carNames } from '../data/Cars';
import { getDownloadURL, uploadBytes, getStorage, ref as storageRef } from 'firebase/storage';

export default function Signup({ navigation }) {
    const [selectedCar, setSelectedCar] = useState(carNames[0]);
    const [makeYear, setMakeYear] = useState(new Date().getFullYear());
    const [condition, setCondition] = useState(5);
    const [profilePicture, setProfilePicture] = useState(null);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const signup = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            const userRef = ref(db, 'users/' + user.uid);
            
            
            if (profilePicture) {


                const fileName = `${user.uid}_profilePicture.jpg`;
                const storage = getStorage();


                const fileRef = storageRef(storage, fileName);
                const image_file = await fetch(profilePicture);
                const blob = await image_file.blob();

                await uploadBytes(fileRef, blob);
                const downloadUrl = await getDownloadURL(fileRef);

                await set(userRef, {
                    email: user.email,
                    car: selectedCar,
                    makeYear: makeYear,
                    condition: condition,
                    sampleRate: 200,
                    profilePictureUrl: downloadUrl
                    
    
                });
            } else {
                await set(userRef, {
                    email: user.email,
                    car: selectedCar,
                    makeYear: makeYear,
                    condition: condition,
                    sampleRate: 200,
    
                });
            }

            
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters long.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account is already registered for this email address.';
            }
            Alert.alert('Signup Error', errorMessage);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1950 + 1), (val, index) => 1950 + index);

    const removeProfilePicture = () => {
        setProfilePicture(null);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
        });


        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
        });


        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleProfilePicture = () => {
        Alert.alert(
            "Profile Picture",
            "Select an option",
            [
                { text: "Add", onPress: () => handleChooseProfilePicture() },
                profilePicture ? { text: "Remove", onPress: () => removeProfilePicture(), style: "destructive" } : null,
                { text: "Cancel", style: "cancel" }
            ].filter(Boolean)
        );
    };

    const handleChooseProfilePicture = () => {
        Alert.alert(
            "Choose Profile Picture",
            "Select an option",
            [
                { text: "Camera", onPress: () => takePhoto() },
                { text: "Gallery", onPress: () => pickImage() },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    return (
        <View style={AuthStyles.container}>
            <TouchableOpacity onPress={handleProfilePicture} style={{ position: 'relative', justifyContent: 'flex-end', overflow: 'hidden' }}>
                {profilePicture ? (

                    <View style={AuthStyles.profileImage} >
                        <ImageBackground source={{ uri: profilePicture }} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                            <View style={{ opacity: 0.7, borderRadius: 15, backgroundColor: 'gray', width: '100%', alignItems: 'center' }}>
                                <Icon name="photo-camera" size={20} color="white" />
                            </View>

                        </ImageBackground>
                    </View>


                ) : (

                    <View style={AuthStyles.profileImage} >
                        <ImageBackground source={require('../assets/user.png')} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                            <View style={{ opacity: 0.7, borderRadius: 15, backgroundColor: 'gray', width: '100%', alignItems: 'center' }}>
                                <Icon name="photo-camera" size={20} color="white" />
                            </View>

                        </ImageBackground>
                    </View>


                )}

            </TouchableOpacity>


            <View style={AuthStyles.inputContainer}>
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                />

                <View style={AuthStyles.passwordContainer}>
                    <TextInput
                        style={AuthStyles.input}
                        placeholder="Password"
                        secureTextEntry={!showPassword}  // Toggle visibility
                        value={password}
                        onChangeText={(p) => setPassword(p)}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={AuthStyles.eyeIconContainer}
                    >
                        <Icon name={showPassword ? "visibility-off" : "visibility"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={AuthStyles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCar}
                        style={AuthStyles.picker}
                        onValueChange={(itemValue) => setSelectedCar(itemValue)}
                    >
                        {carNames.map((car, index) => (
                            <Picker.Item key={index} label={car} value={car} />
                        ))}
                    </Picker>
                </View>

                <View style={AuthStyles.pickerContainer}>
                    <Picker
                        selectedValue={makeYear}
                        style={AuthStyles.picker}
                        onValueChange={(itemValue) => setMakeYear(itemValue)}
                    >
                        {years.map((year, index) => (
                            <Picker.Item key={index} label={`${year}`} value={year} />
                        ))}
                    </Picker>
                </View>

                <View style={AuthStyles.sliderContainer}>
                    <Text style={AuthStyles.sliderLabel}>Condition: {condition}</Text>
                    <Slider
                        style={AuthStyles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={0.5}
                        value={condition}
                        onValueChange={(value) => setCondition(value)}
                        minimumTrackTintColor={foregroundColor1}
                        maximumTrackTintColor={foregroundColor2}
                        thumbTintColor={foregroundColor1}
                    />
                </View>

                {loading && <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />}

                {!loading &&
                    <TouchableOpacity style={AuthStyles.button} onPress={signup}>
                        <Text style={AuthStyles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                }

                {!loading &&
                    <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                        <Text style={AuthStyles.linkText}>Already have an account? Sign In</Text>
                    </TouchableOpacity>
                }
            </View>
        </View >
    );
}
