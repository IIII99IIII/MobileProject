// Importa React para definir componentes funcionales.
import React from 'react';
// Importa componentes nativos de RN para construir la UI.
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
// Hook y componente de control de formularios de react-hook-form.
import { useForm, Controller } from 'react-hook-form';
// Método de Firebase Auth para iniciar sesión con email/clave.
import { signInWithEmailAndPassword } from 'firebase/auth';
// Instancia de autenticación configurada en tu proyecto.
import { auth } from '../../../firebaseConfig';
// Componente para fondos con degradado (Expo).
import { LinearGradient } from 'expo-linear-gradient';

// Componente principal para iniciar sesión. Recibe 'navigation' para cambiar de pantalla.
export default function LoginForm({ navigation }) {

  // Inicializa el formulario usando react-hook-form:
  // - control: conecta inputs al hook
  // - handleSubmit: valida y ejecuta el submit
  // - errors: contiene los errores de cada campo
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales del formulario.
    defaultValues: { email: '', password: '' },
  });

  // onSubmit se ejecuta SOLO si la validación del formulario es correcta.
  const onSubmit = async (data) => {
    try {
      // Intenta iniciar sesión con Firebase utilizando email y password.
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      // Si todo salió bien, muestra por consola el usuario autenticado.
      console.log('¡Login exitoso!', userCredential.user.email);

    } catch (error) {
      // Muestra en consola el error exacto que devuelve Firebase.
      console.error('Error de autenticación:', error.code, error.message);

      // Manejo de errores más habituales de login.
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        Alert.alert(
          'Error de Inicio de Sesión',
          'El correo electrónico o la contraseña son incorrectos.'
        );
      } else {
        // Si es un error desconocido, muestra mensaje genérico.
        Alert.alert(
          'Error',
          'Ocurrió un problema inesperado. Por favor, inténtalo de nuevo.'
        );
      }
    }
  };

  // Render principal de la pantalla.
  return (
    // Aplica un fondo con degradado usando LinearGradient.
    <LinearGradient
      colors={['#e3f2f9', '#c8e0ea', '#b0d3e0']}
      style={styles.gradientBackground}
    >

      {/* Ajusta la vista cuando aparece el teclado (en iOS usa padding, en Android height). */}
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* Permite hacer scroll si el teclado tapa parte del formulario. */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Tarjeta blanca donde vive todo el formulario de login */}
          <View style={styles.card}>

            {/* Logo de la clínica */}
            <Image
              source={require('../../../assets/logo_cf.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Título principal del formulario */}
            <Text style={styles.header}>Ingreso — Odontología Integral</Text>

            {/* ======== Campo EMAIL ======== */}
            <Text style={styles.label}>Email</Text>

            {/* Controller conecta el TextInput con react-hook-form */}
            <Controller
              control={control}
              name="email"
              // Reglas de validación básicas para email.
              rules={{
                required: 'El email es obligatorio.',
                pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Formato de email inválido.' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]} // Estilo dinámico si hay error
                  onBlur={onBlur}      // Marca el input como tocado
                  onChangeText={onChange}
                  value={value}
                  placeholder="tu.correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9FBFD9"
                />
              )}
            />

            {/* Muestra error debajo si la validación falla */}
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            {/* ======== Campo CONTRASEÑA ======== */}
            <Text style={styles.label}>Contraseña</Text>

            <Controller
              control={control}
              name="password"
              // Reglas: requerido y mínimo de 6 caracteres.
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
                  secureTextEntry // Oculta los caracteres
                  placeholderTextColor="#9FBFD9"
                />
              )}
            />

            {/* Error de contraseña si corresponde */}
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            {/* ======== Botón de Iniciar Sesión ======== */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* ======== Enlace a registro (Sign Up) ======== */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>

              {/* Navega a la pantalla de registro */}
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

// Paleta de colores local (será unificada luego con un theme global).
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

// Hoja de estilos completa del Login.
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Ocupa toda la pantalla completa.
  },
  avoidingView: {
    flex: 1, // Permite que el contenido se adapte cuando aparece el teclado.
  },
  scrollContainer: {
    flexGrow: 1, // Deja que el contenido crezca verticalmente dentro del ScrollView.
    justifyContent: 'center', // Centra verticalmente la tarjeta.
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.fondoCard, // Fondo blanco semiopaco.
    borderRadius: 20,
    padding: 24,
    elevation: 6, // Sombra Android.
    shadowColor: '#000', // Sombra iOS.
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
  inputError: {
    borderColor: COLORS.error, // Resalta el borde en rojo si hay error.
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 8,
  },
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
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    color: '#6B8FAF',
  },
  linkText: {
    color: COLORS.verde,
    marginTop: 6,
    fontWeight: '600',
  },
});
