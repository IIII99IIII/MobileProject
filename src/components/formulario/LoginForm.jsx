// ...existing code...
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

export default function LoginForm({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
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
      {/* LOGO */}
      <Image
        source={require('../../../assets/logo_cf.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.header}>Ingreso — Odontología Integral</Text>

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'El email es obligatorio.',
          pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Formato de email inválido.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="tu.correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9FBFD9"
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
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="********"
            secureTextEntry
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const COLORS = {
  primary: '#0B69A3',
  accent: '#29C3A5',
  bg: '#F6FBFF',
  inputBorder: '#E1EEF7',
  text: '#0A2540',
  error: '#E02424'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 22,
    justifyContent: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 12
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
    textAlign: 'center'
  },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginBottom: 8 },

  primaryButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },

  signUpContainer: { marginTop: 16, alignItems: 'center' },
  signUpText: { color: '#6B8FAF' },
  linkText: { color: COLORS.accent, marginTop: 6, fontWeight: '600' }
});