import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import AuthStyles from '../styles/AuthStyles';

export default function Login({ navigation }) {
  return (
    <View style={AuthStyles.container}>
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
        <Text style={AuthStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={AuthStyles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};
