// Core imports for state management, UI components, and navigation
import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
    ScrollView, ActivityIndicator, Alert, ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icon imports
import { Mail, Lock, Car, Calendar, Gauge, ArrowRight } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Styles and constants
import { AuthStyles } from '../styles/AuthStyles';
import { foregroundColor1, foregroundColor2 } from '../styles/SensorStyles';

// Firebase modules
import { FIREBASE_AUTH, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, runTransaction } from 'firebase/database';
import { carNames } from '../data/Cars';
import { getDownloadURL, uploadBytes, getStorage, ref as storageRef } from 'firebase/storage';

// Signup screen component
export default function Signup({ navigation }) {
    // State variables for form data
    const [selectedCar, setSelectedCar] = useState(carNames[0]);
    const [makeYear, setMakeYear] = useState(new Date().getFullYear());
    const [condition, setCondition] = useState(5);
    const [profilePicture, setProfilePicture] = useState(null);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const auth = FIREBASE_AUTH;

    // Validates email and password input before signup
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

    // Handles the sign-up process and Firebase user creation
    const signup = async () => {
        if (!validateInput()) return;

        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            const userRef = ref(db, 'users/' + user.uid);
            const totalUsersRef = ref(db, 'totalUsers/');

            // Update total user count atomically
            runTransaction(totalUsersRef, (currentValue) => (currentValue || 0) + 1);

            // If profile picture is selected, upload to Firebase Storage
            if (profilePicture) {
                const fileName = `${user.uid}_profilePicture.jpg`;
                const storage = getStorage();
                const fileRef = storageRef(storage, fileName);
                const image_file = await fetch(profilePicture);
                const blob = await image_file.blob();

                await uploadBytes(fileRef, blob);
                const downloadUrl = await getDownloadURL(fileRef);

                // Save user data including profile picture URL
                await set(userRef, {
                    email: user.email,
                    car: selectedCar,
                    makeYear: makeYear,
                    condition: condition,
                    sampleRate: 1000,
                    profilePictureUrl: downloadUrl
                });
            } else {
                // Save user data without profile picture
                await set(userRef, {
                    email: user.email,
                    car: selectedCar,
                    makeYear: makeYear,
                    condition: condition,
                    sampleRate: 1000,
                });
            }

        } catch (error) {
            // Handle Firebase Auth errors with user-friendly messages
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

    // Generate an array of years for car manufacturing selection
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1950 + 1), (val, index) => 1950 + index);

    // Clear selected profile picture
    const removeProfilePicture = () => {
        setProfilePicture(null);
    };

    // Pick image from gallery
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

    // Capture image from camera
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

    // Opens dialog to add/remove/change profile picture
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

    // Lets user choose camera or gallery
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.overlay} />
                <Text style={styles.title}>Join RoadInSight</Text>
                <Text style={styles.subtitle}>Create your account</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
                {/* Profile Picture */}
                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 30 }}>
                    <TouchableOpacity onPress={handleProfilePicture}>
                        <View style={AuthStyles.profileImage}>
                            <ImageBackground
                                source={profilePicture ? { uri: profilePicture } : require('../assets/user.png')}
                                style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
                            >
                                <View style={{ opacity: 0.7, borderRadius: 15, backgroundColor: 'gray', width: '100%', alignItems: 'center' }}>
                                    <Icon name="photo-camera" size={20} color="white" />
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Email Field */}
                <View style={styles.inputContainer}>
                    <Mail size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                    />
                </View>

                {/* Password Field */}
                <View style={styles.inputContainer}>
                    <Lock size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        autoComplete="password"
                        secureTextEntry={!showPassword}
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

                {/* Car Picker */}
                <View style={styles.pickerContainer}>
                    <Car size={20} color="#666" style={styles.inputIcon} />
                    <View style={styles.picker}>
                        <Picker selectedValue={selectedCar} onValueChange={setSelectedCar}>
                            {carNames.map((car, index) => (
                                <Picker.Item key={index} label={car} value={car} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Make Year Picker */}
                <View style={styles.pickerContainer}>
                    <Calendar size={20} color="#666" style={styles.inputIcon} />
                    <View style={styles.picker}>
                        <Picker selectedValue={makeYear} onValueChange={setMakeYear}>
                            {years.map((year, index) => (
                                <Picker.Item key={index} label={`${year}`} value={year} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Condition Slider */}
                <View style={styles.conditionContainer}>
                    <View style={styles.conditionHeader}>
                        <Gauge size={20} color="#666" />
                        <Text style={styles.conditionText}>Car Condition: {condition}</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={0.5}
                        value={condition}
                        onValueChange={setCondition}
                        minimumTrackTintColor={foregroundColor1}
                        maximumTrackTintColor={foregroundColor2}
                        thumbTintColor={foregroundColor1}
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabel}>Poor</Text>
                        <Text style={styles.sliderLabel}>Excellent</Text>
                    </View>
                </View>

                {/* Signup Button */}
                {loading ? (
                    <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />
                ) : (
                    <>
                        <TouchableOpacity style={styles.signUpButton} onPress={signup}>
                            <Text style={styles.signUpButtonText}>Create Account</Text>
                            <ArrowRight size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('LogIn')}
                            style={styles.linkButton}
                        >
                            <Text style={styles.linkText}>Already have an account? Sign In</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        height: 200,
        position: 'relative',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: '#0e4c92',
        shadowColor: '#000', // Added shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // For Android
    },
    headerImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.8,
    },
    form: {
        padding: 20,
    },
    imageUpload: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f5f5f5',
        alignSelf: 'center',
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#000', // Added shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // For Android
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 16,
        padding: 4,
        shadowColor: '#000', // Added shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android
    },
    inputIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 16,
        padding: 4,
        shadowColor: '#000', // Added shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android
    },
    picker: {
        flex: 1,
    },
    pickerInput: {
        fontSize: 16,
        paddingVertical: 12,
        paddingRight: 30,
        color: '#333',
    },
    conditionContainer: {
        marginBottom: 24,
    },
    conditionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    conditionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#666',
    },
    signUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0e4c92',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        shadowColor: '#000', // Added shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // For Android
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    linkButton: {
        alignItems: 'center',
        padding: 16,
    },
    linkText: {
        color: '#0e4c92',
        fontSize: 16,
    },
});
