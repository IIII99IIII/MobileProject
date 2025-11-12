// Importa React para componentes funcionales.
import React from 'react';
// Importa componentes base de RN.
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Fondo con degradado.
import { LinearGradient } from 'expo-linear-gradient';
// Hook/controlador de formularios.
import { useForm, Controller } from 'react-hook-form';
// Crea usuarios con email/clave en Firebase Auth.
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Instancia de auth del proyecto.
import { auth } from '../../../firebaseConfig';

// Componente de Registro; recibe navigation.
export default function SignUpForm({ navigation }) {
  // Inicializa el form con control, submit, errores y getValues (para confirmar password).
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    // Valores iniciales de los campos.
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  // Handler del submit correcto.
  const onSubmit = async (data) => {
    try {
      // Intenta crear el usuario en Firebase Auth.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Si funciona, loguea el correo del nuevo usuario.
      console.log('¡Usuario registrado!', userCredential.user.email);
      // Muestra alerta de bienvenida.
      Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
    } catch (error) {
      // Si falla, imprime código y mensaje de error.
      console.error('Error de registro:', error.code, error.message);
      // Manejo de casos típicos: correo en uso / password débil / genérico.
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Este correo electrónico ya está en uso.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        Alert.alert('Error', 'Ocurrió un problema al registrar la cuenta.');
      }
    }
  };

  // Render de la pantalla de registro.
  return (
    // Fondo en degradado suave.
    <LinearGradient colors={['#E6F3FA', '#F6FBFF']} style={styles.gradient}>
      {/* Ajuste del teclado por plataforma. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* Scroll principal de la UI. */}
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Contenedor circular para el logo con un leve degradado. */}
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#ffffff', '#E6F3FA']} style={styles.logoBackground}>
              <Image
                source={require('../../../assets/logo_cf.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* Título de pantalla. */}
          <Text style={styles.header}>Crear Cuenta — Odontología Integral GF</Text>

          {/* Campo EMAIL con validaciones. */}
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

          {/* Campo PASSWORD con longitud mínima. */}
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
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                placeholderTextColor="#9FBFD9"
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Campo CONFIRM PASSWORD que valida igualdad con 'password'. */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Por favor, confirma tu contraseña.',
              validate: (value) =>
                value === getValues('password') || 'Las contraseñas no coinciden.',
            }}
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
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          {/* Botón principal: envía el formulario (valida y ejecuta onSubmit). */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
            <LinearGradient colors={['#0B69A3', '#29C3A5']} style={styles.primaryButtonGradient}>
              <Text style={styles.primaryButtonText}>Registrar Cuenta</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón secundario: volver al login. */}
          <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
            <Text style={styles.backToLoginText}>Volver al inicio</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Colores locales de esta pantalla (luego unificamos con theme).
const COLORS = {
  primary: '#0B69A3',
  accent: '#29C3A5',
  bg: '#F6FBFF',
  inputBorder: '#E1EEF7',
  text: '#0A2540',
  error: '#E02424',
};

// Hoja de estilos de la pantalla de registro.
const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Ocupa todo el alto.
  },
  container: {
    flexGrow: 1, // Crece con contenido.
    padding: 24, // Margen interno.
    justifyContent: 'center', // Centra vertical.
  },
  logoContainer: {
    alignItems: 'center', // Centra logo horizontal.
    marginBottom: 15, // Separación inferior.
  },
  logoBackground: {
    width: 130,
    height: 130,
    borderRadius: 100, // Círculo.
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: 90,
    height: 90,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 8,
    fontSize: 13,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backToLogin: {
    marginTop: 18,
    alignItems: 'center',
  },
  backToLoginText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
