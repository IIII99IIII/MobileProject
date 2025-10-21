// src/components/formulario/SignUpForm.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

export default function SignUpForm({ navigation }) {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('¡Usuario registrado!', userCredential.user.email);
      Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
      // opcional: navigation.goBack() para volver al login
    } catch (error) {
      console.error('Error de registro:', error.code, error.message);
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
      {/* LOGO: guardá tu imagen en /assets/logo_cf.png */}
      <Image
        source={require('../../../assets/logo_cf.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.header}>Crear Cuenta — Odontología Integral GF</Text>

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'El email es obligatorio.', pattern: { value: /^\S+@\S+$/i, message: 'Formato de email inválido.' } }}
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
        rules={{ required: 'La contraseña es obligatoria.', minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres.' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <Controller
        control={control}
        name="confirmPassword"
        rules={{ required: 'Por favor, confirma tu contraseña.', validate: value => value === getValues('password') || 'Las contraseñas no coinciden.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Repite la contraseña"
            secureTextEntry
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.primaryButtonText}>Registrar Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
        <Text style={styles.backToLoginText}>Volver al inicio</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'stretch'
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
    backgroundColor: COLORS.accent,
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

  backToLogin: { marginTop: 12, alignItems: 'center' },
  backToLoginText: { color: '#6B8FAF' }
});
