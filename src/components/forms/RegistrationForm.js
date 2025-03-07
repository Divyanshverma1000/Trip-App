import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { register } from '../../lib/auth';
import AuthInput from './AuthInput';
import styles from '../../styles';


const RegistrationForm = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigation.navigate('Login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Create an Account</Text>
        <Text style={styles.subtitle}>Join Wander today!</Text>
      </View>

      <View style={styles.formContainer}>
        {error && <Text style={styles.error}>{error}</Text>}

        <AuthInput
          icon="user"
          placeholder="Namee"
          value={name}
          onChangeText={setName}
        />
        <AuthInput
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
       <AuthInput
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)} // Fix here
          showPassword={showPassword}
          showPasswordToggle={true} // Add this
       />


        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Register</Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Login Now</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegistrationForm;
