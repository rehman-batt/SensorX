// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { AuthStyles } from '../styles/AuthStyles';
// import { foregroundColor1 } from '../styles/SensorStyles';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// export default function Login({ navigation }) {
//     const [loading, setLoading] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false); 
//     const auth = FIREBASE_AUTH;

//     const validateInput = () => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email) {
//             Alert.alert('Validation Error', 'Please enter your email.');
//             return false;
//         } else if (!emailRegex.test(email)) {
//             Alert.alert('Validation Error', 'Please enter a valid email address.');
//             return false;
//         }

//         if (!password) {
//             Alert.alert('Validation Error', 'Please enter your password.');
//             return false;
//         }

//         return true;
//     };

//     const login = async () => {
//         if (!validateInput()) {
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await signInWithEmailAndPassword(auth, email, password);
//         } catch (error) {
//             let errorMessage = 'An error occurred. Please try again.';
//             console.log(error);
//             if (error.code === 'auth/weak-password') {
//                 errorMessage = 'Password should be at least 6 characters long.';
//             } else if (error.code === 'auth/invalid-email') {
//                 errorMessage = 'Please enter a valid email address.';
//             } else if (error.code === 'auth/wrong-password') {
//                 errorMessage = 'Incorrect password. Please try again.';
//             } else if (error.code === 'auth/user-not-found') {
//                 errorMessage = 'This user does not exist.';
//             } else if (error.code === 'auth/user-disabled') {
//                 errorMessage = 'Contact Admin. Your account had been suspended.';
//             } else if (error.code === 'auth/invalid-credential') {
//                 errorMessage = 'The entered credentials are invalid.';
//             } else if (error.code === 'auth/email-already-in-use') {
//                 errorMessage = 'An account is already registered for this email address.';
//             } else if (error.code === 'auth/credential-already-in-use') {
//                 errorMessage = 'The entered credentials are already in use by another account.';
//             }

//             Alert.alert('Login Error', errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetPassword = async () => {
//         if (!email) {
//             Alert.alert('Reset Password', 'Please enter your email address first.');
//             return;
//         }

//         try {
//             setLoading(true);
//             let response = await sendPasswordResetEmail(auth, email);
//             Alert.alert('Reset Password', 'A password reset link has been sent to your email.');
//         } catch (error) {
//             let errorMessage = 'Failed to send password reset email.';
//             console.log(error);
//             if (error.code === 'auth/invalid-email') {
//                 errorMessage = 'Please enter a valid email address.';
//             } else if (error.code === 'auth/user-not-found') {
//                 errorMessage = 'This user does not exist.';
//             }

//             Alert.alert('Reset Password Error', errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={AuthStyles.container}>
//             <Icon name="person" size={100} color={foregroundColor1} style={AuthStyles.icon} />
//             <View style={AuthStyles.inputContainer}>
//                 <TextInput
//                     style={AuthStyles.input}
//                     placeholder="Email"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     value={email}
//                     onChangeText={(e) => setEmail(e)}
//                 />
//                 <View style={AuthStyles.passwordContainer}>
//                     <TextInput
//                         style={AuthStyles.input}
//                         placeholder="Password"
//                         secureTextEntry={!showPassword} // Toggle visibility
//                         value={password}
//                         onChangeText={(p) => setPassword(p)}
//                     />
//                     <TouchableOpacity
//                         style={AuthStyles.eyeIconContainer}
//                         onPress={() => setShowPassword(!showPassword)} // Toggle the state
//                     >
//                         <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={25} color="gray" />
//                     </TouchableOpacity>
//                 </View>

//                 {loading && <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />}

//                 {!loading && (
//                     <TouchableOpacity style={AuthStyles.button} onPress={login}>
//                         <Text style={AuthStyles.buttonText}>Sign In</Text>
//                     </TouchableOpacity>
//                 )}

//                 {!loading && (
//                     <TouchableOpacity onPress={resetPassword}>
//                         <Text style={AuthStyles.linkText}>Forgot Password? Reset</Text>
//                     </TouchableOpacity>
//                 )}

//                 {!loading && (
//                     <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//                         <Text style={AuthStyles.linkText}>Don't have an account? Sign Up</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );
// }





import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStyles } from '../styles/AuthStyles';
import { foregroundColor1 } from '../styles/SensorStyles';
import { FIREBASE_AUTH } from '../config/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function Login({ navigation }) {


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
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Image
          source={require('../assets/header-bg.png')}
          style={styles.headerImage}
        /> */}
                <View style={styles.overlay} />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* <View style={styles.form}> */}
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <View style={styles.inputContainer}>
                    <Mail size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        autoComplete="password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(p) => setPassword(p)}
                    />
                    <TouchableOpacity
                        style={AuthStyles.eyeIconContainer}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                {loading && <ActivityIndicator color={foregroundColor1} size={50} style={AuthStyles.loading} />}

                {!loading && (

                    <TouchableOpacity style={styles.signInButton} onPress={login}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                        <ArrowRight size={20} color="white" />
                    </TouchableOpacity>

                )}

                {!loading && (
                    <View style={styles.links}>
                        <TouchableOpacity onPress={resetPassword} style={styles.linkButton}>
                            <Text style={styles.linkText}>Forgot password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkButton}>
                            <Text style={styles.linkText}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* </View> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', // updated
    },
    header: {
        height: 260,
        position: 'relative',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: '#0e4c92',
    },
    headerImage: {
        // position: 'absolute',
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
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: 'white',
        opacity: 0.8,
    },
    form: {
        // flex: 1,
        // padding: 20,
        // paddingTop: 40,
        flexGrow: 1,
        padding: 20,
        paddingTop: 40,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    inputIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#0e4c92', // updated
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0e4c92', // updated
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    signInButtonText: {
        color: 'white', // updated
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    linkButton: {
        padding: 8,
    },
    linkText: {
        color: '#0e4c92', // updated
        fontSize: 16,
    },
});
