// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Auth screens
import LoginForm from './src/components/formulario/LoginForm';
import SignUpForm from './src/components/formulario/SignUpForm';

// Main app screens / stacks
import HomeScreen from './src/screens/homeTurnoScreen/HomeTurnoScreen';
import ProfileScreen from './src/screens/profileScreen/ProfileScreen';
import AddTurnoScreen from './src/screens/addTurnoScreen/AddTurnoScreen';
import TurnoListScreen from './src/screens/turnoListScreen/TurnoListScreen';
import EditTurnoScreen from './src/screens/editTurnoScreen/EditTurnoScreen';
import DetailTurnoScreen from './src/screens/detailTurnoScreen/DetailTurnoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} options={{ title: 'Detalle del Turno' }} />
    </Stack.Navigator>
  );
}

function TurnoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TurnoList" component={TurnoListScreen} options={{ title: 'Mis Turnos' }} />
      <Stack.Screen name="AddTurno" component={AddTurnoScreen} options={{ title: 'Añadir Turno' }} />
      <Stack.Screen name="EditTurno" component={EditTurnoScreen} options={{ title: 'Editar Turno' }} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} options={{ title: 'Detalle del Turno' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'InicioTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TurnosTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'PerfilTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="InicioTab" component={HomeStack} options={{ title: 'Inicio' }} />
      <Tab.Screen name="TurnosTab" component={TurnoStack} options={{ title: 'Turnos' }} />
      <Tab.Screen name="PerfilTab" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="SignUp" component={SignUpForm} options={{ title: 'Crear Cuenta' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? <MainAppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
