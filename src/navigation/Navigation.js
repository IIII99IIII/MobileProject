// src/navigation/Navigation.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth
import LoginForm from '../components/formulario/LoginForm';
import SignUpForm from '../components/formulario/SignUpForm';

// Tabs con swipe + íconos abajo
import MainPagerTabs from './MainPagerTabs';

const Stack = createStackNavigator();

export function MainAppTabs() {
  return <MainPagerTabs />;
}

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="SignUp" component={SignUpForm} options={{ title: 'Crear Cuenta' }} />
    </Stack.Navigator>
  );
}
