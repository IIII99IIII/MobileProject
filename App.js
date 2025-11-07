// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import { MainAppTabs, AuthStack } from './src/navigation/Navigation';
import { MenuProvider } from 'react-native-popup-menu'; // <-- importamos MenuProvider

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <MenuProvider> {/* <-- envolvemos la app */}
        <NavigationContainer key={user ? 'user' : 'guest'}>
          {user ? <MainAppTabs /> : <AuthStack />}
        </NavigationContainer>
        <StatusBar style="dark" />
      </MenuProvider>
    </SafeAreaProvider>
  );
}
