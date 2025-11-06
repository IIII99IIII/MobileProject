// src/navigation/Stacks.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/homeTurnoScreen/HomeTurnoScreen';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import AddTurnoScreen from '../screens/addTurnoScreen/AddTurnoScreen';
import TurnoListScreen from '../screens/turnoListScreen/TurnoListScreen';
import EditTurnoScreen from '../screens/editTurnoScreen/EditTurnoScreen';
import DetailTurnoScreen from '../screens/detailTurnoScreen/DetailTurnoScreen';

const Stack = createStackNavigator();

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
