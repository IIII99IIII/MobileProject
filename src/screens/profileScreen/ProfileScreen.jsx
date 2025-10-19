// src/screens/profileScreen/ProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

// 1. Importamos lo necesario de Firebase
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; // Asegúrate que la ruta sea correcta

const ProfileScreen = () => {
  // 2. Creamos la función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // El listener en App.js se encargará de redirigir al Login.
      console.log('¡Sesión cerrada exitosamente!');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Ocurrió un problema al cerrar la sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mi Perfil</Text>
      
      {/* Mostramos información del usuario actual si está disponible */}
      {auth.currentUser && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.emailText}>Logueado como:</Text>
          <Text style={styles.email}>{auth.currentUser.email}</Text>
        </View>
      )}

      {/* 3. Agregamos el botón para cerrar sesión */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cerrar Sesión"
          color="tomato"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
  },
  email: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '80%', // Para que el botón no ocupe toda la pantalla
  }
});

export default ProfileScreen;