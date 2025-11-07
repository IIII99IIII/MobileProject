import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginForm({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('¡Login exitoso!', userCredential.user.email);
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
    <LinearGradient
      colors={['#e3f2f9', '#c8e0ea', '#b0d3e0']}
      style={styles.gradientBackground}
    >
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Image
              source={require('../../../assets/logo_cf.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.header}>Ingreso — Odontología Integral</Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El email es obligatorio.',
                pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Formato de email inválido.' },
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

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es obligatoria.',
                minLength: { value: 6, message: 'Debe tener al menos 6 caracteres.' },
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

            {/* Botón principal */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* Registro */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const COLORS = {
  azulFranja: '#2e7d9d',
  azulTexto: '#2e7d9d',
  verde: '#4caf50',
  gris: '#9e9e9e',
  azulBoton: '#1976d2',
  rojo: '#d32f2f',
  fondoCard: 'rgba(255,255,255,0.95)',
  error: '#d32f2f',
  texto: '#2e7d9d',
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  avoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.fondoCard,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.azulTexto,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.azulTexto,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b0d3e0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.azulTexto,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginBottom: 8 },
  primaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.azulFranja,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpContainer: { marginTop: 20, alignItems: 'center' },
  signUpText: { color: '#6B8FAF' },
  linkText: { color: COLORS.verde, marginTop: 6, fontWeight: '600' },
});
