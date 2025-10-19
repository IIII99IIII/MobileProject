// src/components/SignUpForm.jsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// 1. Importamos la función para CREAR usuarios
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; // La misma configuración de antes

export default function SignUpForm() {
  // 2. Agregamos 'getValues' para poder comparar contraseñas
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '' // Nuevo campo
    }
  });

  // 3. La lógica de envío ahora usa 'createUserWithEmailAndPassword'
  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Si el registro es exitoso, Firebase automáticamente inicia sesión.
      // El listener en App.js hará el resto.
      console.log('¡Usuario registrado y logueado!', userCredential.user.email);
      Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
    } catch (error) {
      console.error('Error de registro:', error.code, error.message);
      // Manejamos errores comunes de registro
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Este correo electrónico ya está en uso.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        Alert.alert('Error', 'Ocurrió un problema al registrar la cuenta.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de Email (sin cambios) */}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'El email es obligatorio.', pattern: { value: /^\S+@\S+$/i, message: 'Formato de email inválido.' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="tu.correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Campo de Contraseña (sin cambios) */}
      <Text style={styles.label}>Contraseña</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'La contraseña es obligatoria.', minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres.' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Mínimo 6 caracteres" secureTextEntry />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* 4. Nuevo campo para confirmar contraseña */}
      <Text style={styles.label}>Confirmar Contraseña</Text>
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'Por favor, confirma tu contraseña.',
          validate: value => // La validación se hace comparando con el otro campo
            value === getValues('password') || 'Las contraseñas no coinciden.'
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Repite la contraseña" secureTextEntry />
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}


      <View style={styles.buttonContainer}>
        <Button title="Registrar Cuenta" color="tomato" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

// Puedes usar los mismos estilos de LoginForm
const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10, paddingVertical: 12, borderRadius: 5, marginBottom: 5, fontSize: 16 },
  errorText: { color: 'red', marginBottom: 15 },
  buttonContainer: { marginTop: 15 }
});