import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStyles } from '../styles/AuthStyles';
import { foregroundColor1, styles } from '../styles/SensorStyles';
import { FIREBASE_AUTH } from '../config/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

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
            const response = await signInWithEmailAndPassword(auth, email, password);
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

    const resetPassword = async () => {
        if (!email) {
            Alert.alert('Reset Password', 'Please enter your email address first.');
            return;
        }

        try {
            setLoading(true);
            let response = await sendPasswordResetEmail(auth, email);
            Alert.alert('Reset Password', 'A password reset link has been sent to your email.');
        } catch (error) {
            let errorMessage = 'Failed to send password reset email.';
            console.log(error);
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'This user does not exist.';
            }

            Alert.alert('Reset Password Error', errorMessage);
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

                {!loading && (
                    <TouchableOpacity onPress={resetPassword}>
                        <Text style={AuthStyles.linkText}>Forgot Password? Reset</Text>
                    </TouchableOpacity>
                )}

                {!loading &&
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={AuthStyles.linkText}>Don't have an account? Sign Up</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}
