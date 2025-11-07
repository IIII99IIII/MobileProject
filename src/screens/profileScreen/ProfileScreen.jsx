// src/screens/profileScreen/ProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserData(userSnap.data());
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, cerrar sesión', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut(auth);
              console.log('¡Sesión cerrada exitosamente!');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un problema al cerrar la sesión.');
            }
          } 
        },
      ],
      { cancelable: true }
    );
  };

  const user = auth.currentUser;

  return (
    <LinearGradient colors={['#e2ecf7ff', '#e2ecf7ff']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>👤 Mi Perfil</Text>

        <View style={styles.card}>
          {user && (
            <>
              <ProfileItem icon="email" label="Correo" value={user.email} />
              <ProfileItem icon="badge" label="Nombre" value={user.displayName || userData?.nombre || 'Admin'} />
              {userData?.telefono && <ProfileItem icon="phone" label="Teléfono" value={userData.telefono} />}
              {userData?.rol && <ProfileItem icon="work" label="Rol" value={userData.rol} />}
              {userData?.direccion && <ProfileItem icon="home" label="Dirección" value={userData.direccion} />}
              <ProfileItem icon="access-time" label="Último acceso" value={new Date(user.metadata.lastSignInTime).toLocaleString()} />
              <ProfileItem icon="calendar-today" label="Cuenta creada" value={new Date(user.metadata.creationTime).toLocaleString()} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// Componente para cada campo del perfil
const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.itemContainer}>
    <MaterialIcons name={icon} size={20} color="#0b4a8aff" style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B69A3',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  itemLabel: { fontSize: 14, color: '#1e90ff', fontWeight: '600' },
  itemValue: { fontSize: 16, color: '#333', fontWeight: '500', marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#da0c0cff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
