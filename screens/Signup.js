import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import AuthStyles from '../styles/AuthStyles';

export default function Signup({ navigation }) {
  return (
    <View style={AuthStyles.container}>
      <TextInput
        style={AuthStyles.input}
        placeholder="Full Name"
      />
      <TextInput
        style={AuthStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={AuthStyles.input}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={AuthStyles.button}>
        <Text style={AuthStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
        <Text style={AuthStyles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};
