// src/navigation/Navigation.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth screens
import LoginForm from '../components/formulario/LoginForm';
import SignUpForm from '../components/formulario/SignUpForm';

// Main app screens / stacks
import HomeScreen from '../screens/homeTurnoScreen/HomeTurnoScreen';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import AddTurnoScreen from '../screens/addTurnoScreen/AddTurnoScreen';
import TurnoListScreen from '../screens/turnoListScreen/TurnoListScreen';
import EditTurnoScreen from '../screens/editTurnoScreen/EditTurnoScreen';
import DetailTurnoScreen from '../screens/detailTurnoScreen/DetailTurnoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* Stacks individuales */
export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} options={{ title: 'Detalle del Turno' }} />
    </Stack.Navigator>
  );
}

export function TurnoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TurnoList" component={TurnoListScreen} options={{ title: 'Mis Turnos' }} />
      <Stack.Screen name="AddTurno" component={AddTurnoScreen} options={{ title: 'Añadir Turno' }} />
      <Stack.Screen name="EditTurno" component={EditTurnoScreen} options={{ title: 'Editar Turno' }} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} options={{ title: 'Detalle del Turno' }} />
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

/* Tabs principal */
export function MainAppTabs() {
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

/* Stack de auth (login / signup) */
export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="SignUp" component={SignUpForm} options={{ title: 'Crear Cuenta' }} />
    </Stack.Navigator>
  );
}
