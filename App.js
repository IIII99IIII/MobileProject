// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// --- 1. IMPORTACIONES ADICIONALES ---
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Importamos las pantallas de autenticación
import LoginForm from './src/components/formulario/LoginForm';
import SignUpForm from './src/components/formulario/SignUpForm';

// Importamos las pantallas de la app principal
import HomeScreen from './src/screens/homeScreen/HomeScreen';
import ProfileScreen from './src/screens/profileScreen/ProfileScreen';

// 👇 IMPORTAMOS LAS NUEVAS PANTALLAS DEL CRUD
import ProductListScreen from './src/screens/productListScreen/ProductListScreen';
import AddProductScreen from './src/screens/addProductScreen/AddProductScreen';
import EditProductScreen from './src/screens/editProductScreen/EditProductScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


// --- NAVEGADORES DE PILA (STACKS) ---

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
    </Stack.Navigator>
  );
}

// 👇 NUEVO STACK PARA EL FLUJO COMPLETO DEL CRUD DE PRODUCTOS
function ProductStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Mis Productos' }} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Añadir Producto' }} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Editar Producto' }} />
        </Stack.Navigator>
    )
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}


// --- NAVEGADOR DE PESTAÑAS (CUANDO EL USUARIO ESTÁ LOGUEADO) ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'InicioTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProductosTab') { // 👇 ÍCONO PARA LA NUEVA PESTAÑA
            iconName = focused ? 'cube' : 'cube-outline';
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
      {/* Asigna cada pestaña a su respectivo componente Stack */}
      <Tab.Screen name="InicioTab" component={HomeStack} options={{ title: 'Inicio' }}/>
      <Tab.Screen name="ProductosTab" component={ProductStack} options={{ title: 'Productos' }}/>
      <Tab.Screen name="PerfilTab" component={ProfileStack} options={{ title: 'Perfil' }}/>
    </Tab.Navigator>
  );
}


// --- NAVEGADOR DE AUTENTICACIÓN (CUANDO EL USUARIO NO ESTÁ LOGUEADO) ---
// No necesita cambios
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginForm} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="SignUp" component={SignUpForm} options={{ title: 'Crear Cuenta' }} />
    </Stack.Navigator>
  );
}


// --- COMPONENTE PRINCIPAL (EL "CEREBRO" O ROUTER) ---
// No necesita cambios
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