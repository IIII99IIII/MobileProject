// src/components/formulario/LoginForm.jsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

export default function LoginForm({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('¡Login exitoso!', userCredential.user.email);
      // El listener en App.js manejará la navegación
    } catch (error) {
      console.error('Error de autenticación:', error.code, error.message);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
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
          pattern: { value: /^\S+@\S+$/i, message: 'Formato de email inválido.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="tu.correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text style={styles.label}>Contraseña</Text>
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es obligatoria.',
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="********" secureTextEntry />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <View style={styles.buttonContainer}>
        {/* Color principal del login cambiado para un look dental más profesional */}
        <Button title="Iniciar Sesión" color="#0066CC" onPress={handleSubmit(onSubmit)} />
      </View>

      <View style={styles.signUpContainer}>
        <Text>¿No tienes una cuenta?</Text>
        <Button title="Regístrate Aquí" color="gray" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10, paddingVertical: 12, borderRadius: 5, marginBottom: 5, fontSize: 16 },
  errorText: { color: 'red', marginBottom: 15 },
  buttonContainer: { marginTop: 15 },
  signUpContainer: { marginTop: 12 }
});
