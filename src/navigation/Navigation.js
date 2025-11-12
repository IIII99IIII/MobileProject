// Navegación tipo Stack (apilada).
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas de autenticación
import LoginForm from '../components/formulario/LoginForm';
import SignUpForm from '../components/formulario/SignUpForm';

// Tabs principales (custom) con swipe
import MainPagerTabs from './MainPagerTabs';

// Instancia de Stack
const Stack = createStackNavigator();

// Componente que renderiza directamente las tabs principales
export function MainAppTabs() {
  return <MainPagerTabs />;
}

// Stack para flujo de autenticación (Login/Registro)
export function AuthStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla de Login */}
      <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Iniciar Sesión' }} />
      {/* Pantalla de Registro */}
      <Stack.Screen name="SignUp" component={SignUpForm} options={{ title: 'Crear Cuenta' }} />
    </Stack.Navigator>
  );
}
