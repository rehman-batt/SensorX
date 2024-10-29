import { Text, View, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_AUTH, db, storage } from '../config/firebase';
import { backgroundColor, foregroundColor1 } from '../styles/SensorStyles';
import { SettingsStyles, deleteButtonColor } from '../styles/SettingsStyles';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { carNames } from '../data/Cars';
import { set, ref, onValue } from 'firebase/database';
import { getDownloadURL, uploadBytes, getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { useDrawerStatus } from '@react-navigation/drawer';


export default function Settings() {

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [selectedCar, setSelectedCar] = useState('None');
    const [makeYear, setMakeYear] = useState('None');
    const [condition, setCondition] = useState(0);
    const [delay, setDelay] = useState(200);
    const [profilePicture, setProfilePicture] = useState(null);
    const [uploading, setUploading] = useState(false);

    const isDrawerOpen = useDrawerStatus() === 'open';

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1950 + 1), (val, index) => 1950 + index);

    const getUserData = async () => {
        const userID = FIREBASE_AUTH.currentUser?.uid;
        if (userID) {
            try {
                setDataLoading(true);

                const userRef = await ref(db, 'users/' + userID);

                await onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setSelectedCar(userData.car || 'None');
                        setMakeYear(userData.makeYear || 'None');
                        setCondition(userData.condition || 0);
                        setDelay(userData.sampleRate || 200);
                        if (userData.profilePictureUrl) {
                            setProfilePicture(userData.profilePictureUrl);
                        }
                    } else {
                        console.log("No user data found");
                    }
                })

            } catch (error) {
                console.log("Error fetching user data: ", error);
                Alert.alert('Data Fetching Error', error);
            } finally {

                setDataLoading(false);

            }
        }
    };

    useEffect(() => {
        getUserData();
    }, [isDrawerOpen]);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
        });


        if (!result.canceled) {
            uploadProfilePicture(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
        });


        if (!result.canceled) {
            uploadProfilePicture(result.assets[0].uri);
        }
    };

    const removeProfilePicture = async () => {
        const userID = FIREBASE_AUTH.currentUser?.uid;

        if (!userID) return;
        if (!profilePicture) return;

        const storage = getStorage();
        const fileName = `${userID}_profilePicture.jpg`;
        const fileRef = storageRef(storage, fileName);

        Alert.alert(
            "Remove Profile Picture",
            "Are you sure you want to remove your profile picture?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, remove",
                    onPress: async () => {
                        setUploading(true);
                        try {
                            await deleteObject(fileRef);
                            setProfilePicture(null);

                            const user = FIREBASE_AUTH.currentUser;
                            const userRef = ref(db, 'users/' + user.uid);
                            await set(userRef, {
                                email: user.email,
                                car: selectedCar,
                                makeYear: makeYear,
                                condition: condition,
                                sampleRate: delay,


                            });

                        } catch (error) {
                            console.log('Error removing profile picture: ', error);
                            Alert.alert('Error', 'Failed to remove the profile picture. Please try again.');
                        } finally {
                            setUploading(false);
                        }
                    }
                }
            ]
        );
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



    const uploadProfilePicture = async (imageUri) => {
        setUploading(true);

        try {
            const userID = FIREBASE_AUTH.currentUser?.uid;

            const fileName = `${userID}_profilePicture.jpg`;
            const storage = getStorage();


            const fileRef = storageRef(storage, fileName);
            const response = await fetch(imageUri);
            const blob = await response.blob();

            await uploadBytes(fileRef, blob);
            const downloadUrl = await getDownloadURL(fileRef);
            await set(ref(db, 'users/' + userID), {
                profilePictureUrl: downloadUrl,
                car: selectedCar,
                makeYear: makeYear,
                condition: condition,
                sampleRate: delay,
                email: FIREBASE_AUTH.currentUser.email,
            });

            setProfilePicture(downloadUrl);
            Alert.alert("Profile picture updated successfully");
        } catch (error) {
            console.log("Error uploading profile picture: ", error);
            Alert.alert("Error", "Failed to upload profile picture. Please try again.");
        } finally {
            setUploading(false);
        }

    };

    const deleteUser = async () => {
        setLoading(true);
        Alert.alert(
            "Are you sure?",
            "This action cannot be undone. Do you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => setLoading(false),
                    style: "cancel"
                },
                {
                    text: "Yes, delete",
                    onPress: async () => {
                        try {
                            await FIREBASE_AUTH.currentUser.delete();
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Error while deleting user. Please try again later");
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: false }
        );
    };

    const updateCarData = async () => {

        try {
            const user = FIREBASE_AUTH.currentUser;
            const userRef = ref(db, 'users/' + user.uid);
            await set(userRef, {
                email: user.email,
                car: selectedCar,
                makeYear: makeYear,
                condition: condition,
                sampleRate: delay,
                profilePictureUrl: profilePicture,

            });
        } catch (firestoreError) {
            console.error('Error saving user data to Firestore:', firestoreError);
            Alert.alert('Data Save Error', 'Failed to save user information. Please try again.');
        };
    }

    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, paddingVertical: 20 }}>
            {!uploading &&
                <>

                    <TouchableOpacity onPress={handleProfilePicture} style={{ position: 'relative', justifyContent: 'flex-end', overflow: 'hidden' }}>
                        {profilePicture ? (

                            <View style={SettingsStyles.profileImage} >
                                <ImageBackground source={{ uri: profilePicture }} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                                    <View style={{ opacity: 0.7, borderRadius: 15, backgroundColor: 'gray', width: '100%', alignItems: 'center' }}>
                                        <Icon name="photo-camera" size={20} color="white" />
                                    </View>

                                </ImageBackground>
                            </View>


                        ) : (

                            <View style={SettingsStyles.profileImage} >
                                <ImageBackground source={require('../assets/user.png')} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                                    <View style={{ opacity: 0.7, borderRadius: 15, backgroundColor: 'gray', width: '100%', alignItems: 'center' }}>
                                        <Icon name="photo-camera" size={20} color="white"   />
                                    </View>

                                </ImageBackground>
                            </View>


                        )}

                    </TouchableOpacity>


                    <View style={SettingsStyles.userDataContainer}>
                        {!dataLoading &&
                            <>
                                <Text style={SettingsStyles.carDataTitle}>Car Data</Text>
                                <View style={SettingsStyles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedCar}
                                        style={SettingsStyles.picker}
                                        onValueChange={(itemValue) => setSelectedCar(itemValue)}
                                    >
                                        {carNames.map((car, index) => (
                                            <Picker.Item key={index} label={car} value={car} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={SettingsStyles.pickerContainer}>
                                    <Picker
                                        selectedValue={makeYear}
                                        style={SettingsStyles.picker}
                                        onValueChange={(itemValue) => setMakeYear(itemValue)}
                                    >
                                        {years.map((year, index) => (
                                            <Picker.Item key={index} label={`${year}`} value={year} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={SettingsStyles.sliderContainer}>
                                    <Text style={SettingsStyles.sliderLabel}>Condition: {condition}</Text>
                                    <Slider
                                        style={SettingsStyles.slider}
                                        minimumValue={1}
                                        maximumValue={10}
                                        step={0.5}
                                        value={condition}
                                        onValueChange={(value) => setCondition(value)}
                                        minimumTrackTintColor="#0e4c92"
                                        maximumTrackTintColor="black"
                                        thumbTintColor="#0e4c92"
                                    />
                                </View>

                                <View style={SettingsStyles.sliderContainer}>
                                    <Text style={SettingsStyles.sliderLabel}>Sampling Rate: {delay}</Text>
                                    <Slider
                                        style={SettingsStyles.slider}
                                        minimumValue={100}
                                        maximumValue={15000}
                                        minimumTrackTintColor={foregroundColor1}
                                        maximumTrackTintColor="#000000"
                                        thumbTintColor={foregroundColor1}
                                        value={delay}
                                        onValueChange={(curr) => { setDelay(curr) }}
                                        step={100}
                                    />
                                </View>

                                <TouchableOpacity style={SettingsStyles.button} onPress={updateCarData}>
                                    <Text style={SettingsStyles.buttonText}>Update</Text>
                                </TouchableOpacity>
                            </>
                        }

                        {dataLoading && <ActivityIndicator color={foregroundColor1} size={50} style={SettingsStyles.dataActivityIndicator} />}
                    </View>



                    <View style={SettingsStyles.accountButtonContiner}>
                        {!loading && <TouchableOpacity style={SettingsStyles.deleteButton} onPress={deleteUser}>
                            <Icon2 name="deleteuser" size={20} style={SettingsStyles.deleteIcon}></Icon2>
                            <Text style={SettingsStyles.buttonText}>Delete</Text>
                        </TouchableOpacity>}

                        {loading && <ActivityIndicator color={deleteButtonColor} size={35} style={SettingsStyles.deleteActivityIndicator} />}

                        <TouchableOpacity style={SettingsStyles.logoutButton} onPress={() => FIREBASE_AUTH.signOut()}>
                            <Text style={SettingsStyles.buttonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }

            {uploading && <ActivityIndicator color={foregroundColor1} size={100} />}
        </ScrollView>
    );
}
