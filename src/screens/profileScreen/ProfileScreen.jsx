// src/screens/profileScreen/ProfileScreen.jsx

// Importa React y hooks de estado/efecto
import React, { useEffect, useState } from 'react';
// Importa componentes básicos de React Native
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
// Importa función para cerrar sesión desde Firebase Auth
import { signOut } from 'firebase/auth';
// Importa la instancia de autenticación (auth) y la base de datos (db)
import { auth, db } from '../../../firebaseConfig';
// Importa funciones para leer un documento específico en Firestore
import { doc, getDoc } from 'firebase/firestore';
// Importa el componente de fondo con degradado
import { LinearGradient } from 'expo-linear-gradient';
// Importa íconos de Material Design
import { MaterialIcons } from '@expo/vector-icons';

// Componente principal de la pantalla de perfil
const ProfileScreen = ({ navigation }) => {
  // Estado local donde se guardarán los datos adicionales del usuario almacenados en Firestore
  const [userData, setUserData] = useState(null);

  // useEffect que se ejecuta una vez al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener los datos del usuario actual desde Firestore
    const fetchUserData = async () => {
      // Si no hay usuario logueado, se corta la ejecución
      if (!auth.currentUser) return;
      try {
        // Referencia al documento dentro de la colección "usuarios" con el UID del usuario actual
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        // Obtiene el documento de Firestore
        const userSnap = await getDoc(userRef);
        // Si el documento existe, guarda los datos en el estado userData
        if (userSnap.exists()) setUserData(userSnap.data());
      } catch (error) {
        // Si ocurre un error en la lectura, lo muestra en consola
        console.error('Error obteniendo datos del usuario:', error);
      }
    };
    // Ejecuta la función de carga al iniciar
    fetchUserData();
  }, []); // [] indica que solo se ejecuta una vez al montar el componente

  // Función que se ejecuta cuando el usuario quiere cerrar sesión
  const handleLogout = () => {
    // Muestra una alerta de confirmación
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        // Botón de cancelar, no hace nada
        { text: 'Cancelar', style: 'cancel' },
        { 
          // Botón para confirmar cierre de sesión
          text: 'Sí, cerrar sesión', 
          style: 'destructive', // color rojo en iOS
          onPress: async () => {
            try {
              // Llama a signOut para cerrar sesión en Firebase Auth
              await signOut(auth);
              console.log('¡Sesión cerrada exitosamente!');
              // (Podrías agregar navigation.reset aquí para volver al login)
            } catch (error) {
              // Si ocurre un error, lo muestra en consola y en una alerta
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un problema al cerrar la sesión.');
            }
          } 
        },
      ],
      { cancelable: true } // permite cerrar la alerta tocando fuera
    );
  };

  // Variable con la información del usuario autenticado actual
  const user = auth.currentUser;

  // Render principal de la interfaz
  return (
    // Fondo con degradado azul claro (en este caso el mismo color arriba y abajo)
    <LinearGradient colors={['#e2ecf7ff', '#e2ecf7ff']} style={styles.background}>
      {/* ScrollView para permitir desplazarse en pantallas pequeñas */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Título principal */}
        <Text style={styles.headerTitle}>👤 Mi Perfil</Text>

        {/* Tarjeta contenedora de los datos del perfil */}
        <View style={styles.card}>
          {/* Si existe usuario logueado, muestra sus datos */}
          {user && (
            <>
              {/* Campo del correo electrónico */}
              <ProfileItem icon="email" label="Correo" value={user.email} />
              
              {/* Campo del nombre: prioriza displayName, luego nombre en Firestore, y por último 'Admin' */}
              <ProfileItem icon="badge" label="Nombre" value={user.displayName || userData?.nombre || 'Admin'} />
              
              {/* Campo del teléfono si existe en los datos del usuario */}
              {userData?.telefono && <ProfileItem icon="phone" label="Teléfono" value={userData.telefono} />}
              
              {/* Campo del rol si existe */}
              {userData?.rol && <ProfileItem icon="work" label="Rol" value={userData.rol} />}
              
              {/* Campo de la dirección si existe */}
              {userData?.direccion && <ProfileItem icon="home" label="Dirección" value={userData.direccion} />}
              
              {/* Fecha y hora del último acceso */}
              <ProfileItem icon="access-time" label="Último acceso" value={new Date(user.metadata.lastSignInTime).toLocaleString()} />
              
              {/* Fecha de creación de la cuenta */}
              <ProfileItem icon="calendar-today" label="Cuenta creada" value={new Date(user.metadata.creationTime).toLocaleString()} />
            </>
          )}
        </View>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          {/* Icono de cerrar sesión */}
          <MaterialIcons name="logout" size={22} color="#fff" style={{ marginRight: 6 }} />
          {/* Texto del botón */}
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// Componente auxiliar que representa una fila (icono + etiqueta + valor)
const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.itemContainer}>
    {/* Icono del campo */}
    <MaterialIcons name={icon} size={20} color="#0b4a8aff" style={{ marginRight: 12 }} />
    {/* Contenedor del texto */}
    <View style={{ flex: 1 }}>
      {/* Etiqueta (ej: Correo, Nombre) */}
      <Text style={styles.itemLabel}>{label}</Text>
      {/* Valor del campo (ej: nombre@correo.com) */}
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

// Estilos de la pantalla
const styles = StyleSheet.create({
  background: { flex: 1 }, // Hace que el fondo ocupe toda la pantalla

  container: {
    padding: 20,            // Márgenes internos
    alignItems: 'center',   // Centra los elementos horizontalmente
  },

  headerTitle: {
    fontSize: 28,           // Tamaño de letra grande
    fontWeight: 'bold',     // Negrita
    color: '#0B69A3',       // Azul oscuro
    marginBottom: 20,       // Separación inferior
  },

  card: {
    width: '100%',          // Ocupa todo el ancho disponible
    backgroundColor: '#fff',// Fondo blanco
    borderRadius: 16,       // Bordes redondeados
    padding: 22,            // Espaciado interno
    elevation: 6,           // Sombra (Android)
    shadowColor: '#000',    // Color de sombra (iOS)
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 30,       // Separación con el botón
  },

  itemContainer: {
    flexDirection: 'row',   // Coloca icono y texto en una fila
    alignItems: 'center',   // Centra verticalmente
    marginBottom: 18,       // Separación entre filas
  },

  itemLabel: { 
    fontSize: 14, 
    color: '#1e90ff',       // Azul claro
    fontWeight: '600'       // Seminegrita
  },

  itemValue: { 
    fontSize: 16, 
    color: '#333',          // Gris oscuro
    fontWeight: '500', 
    marginTop: 2            // Pequeña separación entre label y valor
  },

  logoutButton: {
    flexDirection: 'row',   // Icono + texto alineados horizontalmente
    backgroundColor: '#da0c0cff', // Rojo intenso
    paddingVertical: 14,    // Alto del botón
    paddingHorizontal: 24,  // Ancho del botón
    borderRadius: 14,       // Bordes redondeados
    alignItems: 'center',   // Centra verticalmente
    justifyContent: 'center', // Centra horizontalmente
    elevation: 4,           // Sombra
  },

  logoutText: {
    color: '#fff',          // Texto blanco
    fontWeight: 'bold',     // Negrita
    fontSize: 16,           // Tamaño medio
  },
});

// Exporta el componente principal
export default ProfileScreen;
