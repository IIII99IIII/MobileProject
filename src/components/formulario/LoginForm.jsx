// src/components/LoginForm.jsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// --- 1. IMPORTACIONES DE FIREBASE ---
// Importamos la función para iniciar sesión y nuestro objeto 'auth' configurado
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';// ¡Asegúrate de que la ruta a tu firebaseConfig.js sea correcta!

export default function LoginForm({navigation}) {
  // Nota: No necesitas 'reset' aquí, ya que el componente se desmontará al iniciar sesión
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // --- 2. LÓGICA DE LOGIN CON FIREBASE ---
  // La función ahora es 'async' para poder usar 'await' con Firebase
  const onSubmit = async (data) => {
    try {
      // Usamos la función de Firebase para intentar iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Si el login es exitoso, Firebase se encarga. El listener en App.js
      // detectará el cambio y mostrará la pantalla principal.
      // No necesitamos hacer nada más aquí.
      console.log('¡Login exitoso!', userCredential.user.email);

    } catch (error) {
      // Si Firebase devuelve un error, lo capturamos aquí
      console.error('Error de autenticación:', error.code, error.message);

      // Mostramos una alerta amigable al usuario
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        Alert.alert('Error de Inicio de Sesión', 'El correo electrónico o la contraseña son incorrectos.');
      } else {
        Alert.alert('Error', 'Ocurrió un problema inesperado. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'El email es obligatorio.',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Formato de email inválido.'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="tu.correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text style={styles.label}>Contraseña</Text>
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es obligatoria.',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres.'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="********"
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <View style={styles.buttonContainer}>
        {/* El onPress sigue usando handleSubmit, que ahora llamará a nuestra nueva función onSubmit asíncrona */}
        <Button title="Iniciar Sesión" color="tomato" onPress={handleSubmit(onSubmit)} />
      </View>
       {/* 👇 2. Añade un botón o texto para navegar a la pantalla de registro */}
      <View style={styles.signUpContainer}>
        <Text>¿No tienes una cuenta?</Text>
        <Button
          title="Regístrate Aquí"
          color="gray"
          onPress={() => navigation.navigate('SignUp')} // Navega a la pantalla definida en AuthStack
        />
      </View>
    </View>
  );
}

// Los estilos no necesitan ningún cambio
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 15,
  }
});