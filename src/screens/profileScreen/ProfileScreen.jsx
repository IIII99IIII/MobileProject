// src/screens/profileScreen/ProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('¡Sesión cerrada exitosamente!');
      // navigation automática la maneja el listener en App.js
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Ocurrió un problema al cerrar la sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mi Perfil</Text>
      {auth.currentUser && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.emailText}>Logueado como:</Text>
          <Text style={styles.email}>{auth.currentUser.email}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Cerrar Sesión" color="tomato" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 24, fontWeight: 'bold' },
  userInfoContainer: { marginVertical: 30, alignItems: 'center' },
  emailText: { fontSize: 16, color: 'gray' },
  email: { fontSize: 18, fontWeight: '500' },
  buttonContainer: { width: '80%' }
});

export default ProfileScreen;
