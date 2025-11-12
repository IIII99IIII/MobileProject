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

// Exporta el componente por defecto; recibe 'navigation' desde React Navigation.
export default function LoginForm({ navigation }) {
  // Inicializa el form: control para inputs, handleSubmit para submit,
  // y 'errors' para mostrar mensajes de validación.
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales para los campos.
    defaultValues: { email: '', password: '' },
  });

  // Función asíncrona que se ejecuta al enviar el formulario válido.
  const onSubmit = async (data) => {
    try {
      // Intenta autenticar al usuario con email y password mediante Firebase.
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // Si no falla, registra en consola el correo del usuario autenticado.
      console.log('¡Login exitoso!', userCredential.user.email);
    } catch (error) {
      // En caso de error, muestra detalle por consola (código y mensaje de Firebase).
      console.error('Error de autenticación:', error.code, error.message);
      // Si la clave es incorrecta o el usuario no existe, alerta de credenciales invalidas.
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        Alert.alert('Error de Inicio de Sesión', 'El correo electrónico o la contraseña son incorrectos.');
      } else {
        // Para cualquier otro error, muestra un mensaje genérico.
        Alert.alert('Error', 'Ocurrió un problema inesperado. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Render del componente
  return (
    // Fondo con degradado; aplica estilos del StyleSheet.
    <LinearGradient
      colors={['#e3f2f9', '#c8e0ea', '#b0d3e0']}
      style={styles.gradientBackground}
    >
      {/* Ajusta el layout cuando aparece el teclado (iOS padding / Android height). */}
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Scroll para permitir desplazamiento si el teclado/altura oculta elementos. */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tarjeta contenedora del formulario */}
          <View style={styles.card}>
            {/* Logo de la app/clinica */}
            <Image
              source={require('../../../assets/logo_cf.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Título de pantalla */}
            <Text style={styles.header}>Ingreso — Odontología Integral</Text>

            {/* Etiqueta Email */}
            <Text style={styles.label}>Email</Text>
            {/* Controller vincula el TextInput con react-hook-form */}
            <Controller
              control={control}
              name="email"
              // Reglas de validación: requerido y patrón de email básico.
              rules={{
                required: 'El email es obligatorio.',
                pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Formato de email inválido.' },
              }}
              // Renderiza el TextInput controlado (onChange, onBlur, value viene del form).
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
            {/* Si hay error en email, muestra el mensaje. */}
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            {/* Etiqueta Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              // Reglas: requerido y mínimo 6 caracteres.
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
            {/* Mensaje de error para password si aplica. */}
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            {/* Botón para enviar el formulario; usa handleSubmit que valida y ejecuta onSubmit. */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* Enlace hacia registro si no tiene cuenta */}
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

// Paleta local (esta se reemplazará con theme compartido más abajo).
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

// Hoja de estilos de la pantalla.
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Ocupa toda la pantalla.
  },
  avoidingView: {
    flex: 1, // Permite que KeyboardAvoidingView expanda.
  },
  scrollContainer: {
    flexGrow: 1, // Permite que el ScrollView crezca con su contenido.
    justifyContent: 'center', // Centra el card verticalmente.
    padding: 20, // Margen interior lateral.
  },
  card: {
    width: '100%', // Ocupa el ancho disponible.
    backgroundColor: COLORS.fondoCard, // Fondo casi blanco.
    borderRadius: 20, // Bordes redondeados.
    padding: 24, // Padding interno.
    elevation: 6, // Sombra en Android.
    shadowColor: '#000', // Sombra en iOS.
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  logo: {
    width: 130, // Tamaño del logo.
    height: 130,
    alignSelf: 'center', // Centrado horizontal.
    marginBottom: 10, // Separación con el título.
  },
  header: {
    fontSize: 22, // Tamaño del título.
    fontWeight: '700', // Negrita fuerte.
    color: COLORS.azulTexto, // Color principal.
    marginBottom: 20, // Espacio bajo el título.
    textAlign: 'center', // Centrado.
  },
  label: {
    fontSize: 14, // Tamaño etiqueta.
    fontWeight: '600', // Semi-negrita.
    color: COLORS.azulTexto,
    marginBottom: 6, // Separación con input.
  },
  input: {
    backgroundColor: '#fff', // Fondo blanco del input.
    borderWidth: 1, // Borde fino.
    borderColor: '#b0d3e0', // Borde celeste claro.
    paddingHorizontal: 12, // Padding horizontal.
    paddingVertical: 12, // Padding vertical.
    borderRadius: 10, // Bordes redondeados.
    marginBottom: 10, // Separación entre inputs.
    fontSize: 16, // Tamaño texto input.
    color: COLORS.azulTexto, // Color texto input.
  },
  inputError: { borderColor: COLORS.error }, // Cambia color de borde cuando hay error.
  errorText: { color: COLORS.error, marginBottom: 8 }, // Estilo texto de error.
  primaryButton: {
    marginTop: 12, // Separación arriba.
    backgroundColor: COLORS.azulFranja, // Color botón.
    paddingVertical: 14, // Altura del botón.
    borderRadius: 12, // Bordes redondeados.
    alignItems: 'center', // Centra el texto.
    elevation: 3, // Sombra Android.
  },
  primaryButtonText: {
    color: 'white', // Texto blanco.
    fontSize: 16, // Tamaño texto.
    fontWeight: '700', // Negrita.
  },
  signUpContainer: { marginTop: 20, alignItems: 'center' }, // Contenedor enlace registro.
  signUpText: { color: '#6B8FAF' }, // Texto "¿No tienes cuenta?"
  linkText: { color: COLORS.verde, marginTop: 6, fontWeight: '600' }, // Link a registro.
});
