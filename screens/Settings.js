import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { AuthStyles } from '../styles/AuthStyles';
import { FIREBASE_AUTH } from '../config/firebase';
import { backgroundColor } from '../styles/SensorStyles';



export default function Settings({}) {

    const deleteUser = async () => {
        try {
            let response = await FIREBASE_AUTH.currentUser.delete();
        } catch (error) {
            console.log(error);
            Alert.alert("Error while deleting user. Please try again later");
        }
        // finally {
        //     FIREBASE_AUTH.signOut();
        // }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor }}>
            <TouchableOpacity style={AuthStyles.button} onPress={deleteUser}>
                <Text style={AuthStyles.buttonText}>Delete User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={AuthStyles.button} onPress={() => FIREBASE_AUTH.signOut()}>
                <Text style={AuthStyles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            

        </View>

    );
}


