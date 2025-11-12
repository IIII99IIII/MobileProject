import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importa pantallas de cada dominio
import HomeScreen from '../screens/homeTurnoScreen/HomeTurnoScreen';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import AddTurnoScreen from '../screens/addTurnoScreen/AddTurnoScreen';
import TurnoListScreen from '../screens/turnoListScreen/TurnoListScreen';
import EditTurnoScreen from '../screens/editTurnoScreen/EditTurnoScreen';
import DetailTurnoScreen from '../screens/detailTurnoScreen/DetailTurnoScreen';
import PacienteListScreen from '../screens/pacienteScreen/PacienteListScreen';
import AddPacienteScreen from '../screens/pacienteScreen/AddPacienteScreen';
import EditPacienteScreen from '../screens/pacienteScreen/EditPacienteScreen';
import DetailPacienteScreen from '../screens/pacienteScreen/DetailPacienteScreen';

// Crea instancia de Stack
const Stack = createStackNavigator();

// Stack para Inicio (Home + acceso a detalle de turnos)
export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="DetailTurno" component={DetailTurnoScreen} options={{ title: 'Detalle del Turno' }} />
    </Stack.Navigator>
  );
}

// Stack para gestión de Turnos
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

// Stack para Perfil del usuario
export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

// Stack para gestión de Pacientes
export function PacienteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PacienteList"
        component={PacienteListScreen}
        options={{ title: 'Pacientes' }}
      />
      <Stack.Screen
        name="AddPaciente"
        component={AddPacienteScreen}
        options={{ title: 'Agregar Paciente' }}
      />
      <Stack.Screen
        name="EditPaciente"
        component={EditPacienteScreen}
        options={{ title: 'Editar Paciente' }}
      />
      <Stack.Screen
        name="DetailPaciente"
        component={DetailPacienteScreen}
        options={{ title: 'Detalle del Paciente' }}
      />
    </Stack.Navigator>
  );
}
