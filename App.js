// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import { MainAppTabs, AuthStack } from './src/navigation/Navigation';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // opcional: evita parpadeos mientras auth se inicializa

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Si quisieras, podrías mostrar splash/loading mientras !ready
  return (
    <NavigationContainer>
      {user ? <MainAppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
 