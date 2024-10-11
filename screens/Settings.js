import { Text, View, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH, db } from '../config/firebase';
import { backgroundColor, foregroundColor1 } from '../styles/SensorStyles';
import { SettingsStyles, deleteButtonColor } from '../styles/SettingsStyles';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { carNames } from '../data/Cars';
import { set, ref, onValue } from 'firebase/database';
import { useDrawerStatus } from '@react-navigation/drawer';

export default function Settings() {

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [selectedCar, setSelectedCar] = useState('None');
    const [makeYear, setMakeYear] = useState('None');
    const [condition, setCondition] = useState(0);
    const [delay, setDelay] = useState(200);

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
            });
        } catch (firestoreError) {
            console.error('Error saving user data to Firestore:', firestoreError);
            Alert.alert('Data Save Error', 'Failed to save user information. Please try again.');
        };
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, paddingVertical: 20 }}>
            <Icon name="person" size={100} color={foregroundColor1} style={SettingsStyles.icon} />

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
                                maximumValue={1000}
                                minimumTrackTintColor={foregroundColor1}
                                maximumTrackTintColor="#000000"
                                thumbTintColor={foregroundColor1}
                                value={delay}
                                onValueChange={(curr) => { setDelay(curr) }}
                                step={50}
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
        </ScrollView>
    );
}
