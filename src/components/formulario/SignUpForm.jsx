// Importa React para poder crear componentes funcionales.
import React from 'react';
// Importa componentes base de React Native para construir la UI.
import {
  View,               // Contenedor básico para estructurar la UI (div en RN).
  Text,               // Componente para mostrar texto en pantalla.
  TextInput,          // Campo de entrada de texto editable por el usuario.
  TouchableOpacity,   // Botón táctil que baja opacidad al presionar (efecto visual).
  StyleSheet,         // Permite crear estilos optimizados para RN.
  Alert,              // Muestra ventanas de alerta nativas (iOS/Android).
  Image,              // Renderiza imágenes desde assets o URL.
  ScrollView,         // Permite desplazar contenido hacia arriba/abajo si es largo.
  KeyboardAvoidingView,// Ajusta la vista cuando aparece el teclado (evita que tape inputs).
  Platform,           // Detecta si la app corre en iOS o Android para comportamientos específicos.
} from 'react-native';
// Importa un fondo con degradado desde Expo.
import { LinearGradient } from 'expo-linear-gradient';
// Importa herramientas para manejar formularios y validaciones.
import { useForm, Controller } from 'react-hook-form';
// Función de Firebase Auth para crear usuarios con email y contraseña.
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Trae la instancia de autenticación configurada del proyecto.
import { auth } from '../../../firebaseConfig';

// Componente de registro de usuario. Recibe "navigation" para ir hacia otras pantallas.
export default function SignUpForm({ navigation }) {

  // Inicializa el formulario con react-hook-form.
  // control -> maneja los inputs
  // handleSubmit -> valida y ejecuta onSubmit
  // errors -> almacena errores de validación
  // getValues -> permite leer valores de otros campos (útil para confirmar contraseña)
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    // Valores iniciales de los campos.
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  // Función que se ejecuta cuando el formulario es válido y se toca "Registrar Cuenta".
  const onSubmit = async (data) => {
    try {
      // Intenta crear un usuario en Firebase Auth con email y contraseña.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Si todo salió bien, muestra por consola el correo registrado.
      console.log('¡Usuario registrado!', userCredential.user.email);

      // Alerta visual para el usuario.
      Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');

    } catch (error) {
      // Si falla algo, lo imprime en consola.
      console.error('Error de registro:', error.code, error.message);

      // Manejo de errores más comunes de Firebase.
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Este correo electrónico ya está en uso.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        Alert.alert('Error', 'Ocurrió un problema al registrar la cuenta.');
      }
    }
  };

  // Renderiza la interfaz de la pantalla de registro.
  return (
    // Aplica un fondo con degradado suave.
    <LinearGradient colors={['#E6F3FA', '#F6FBFF']} style={styles.gradient}>
      
      {/* Reposiciona la pantalla para que el teclado no tape los inputs. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        
        {/* Permite hacer scroll si la pantalla es chica. */}
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Muestra el logo dentro de un círculo con sombra y leve degradado. */}
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#ffffff', '#E6F3FA']} style={styles.logoBackground}>
              <Image
                source={require('../../../assets/logo_cf.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* Texto principal de la pantalla. */}
          <Text style={styles.header}>Crear Cuenta — Odontología Integral GF</Text>

          {/* === CAMPO EMAIL === */}
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}            // Conecta este input al formulario.
            name="email"                 // Nombre interno del campo.
            rules={{
              required: 'El email es obligatorio.',                    // Valida que no esté vacío.
              pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Formato de email inválido.' }, // Valida formato.
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]} // Cambia estilo si hay error.
                onBlur={onBlur}             // Marca cuando el input pierde foco.
                onChangeText={onChange}     // Actualiza el valor en form hook.
                value={value}               // Valor actual del formulario.
                placeholder="tu.correo@ejemplo.com"  // Texto guía que aparece cuando el input está vacío.
                keyboardType="email-address" // Muestra un teclado especial optimizado para escribir correos electrónicos.
                autoCapitalize="none"     // Evita que la primera letra se ponga en mayúscula automáticamente.
                placeholderTextColor="#9FBFD9"  // Color del texto del placeholder.
              />
            )}
          />
          {/* Si hay error, lo muestra debajo del campo. */}
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* === CAMPO PASSWORD === */}
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
                secureTextEntry      // Oculta caracteres al escribir.
                placeholderTextColor="#9FBFD9"
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* === CAMPO CONFIRMAR PASSWORD === */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Por favor, confirma tu contraseña.',
              // Verifica que coincida con el campo 'password'.
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

          {/* Botón grande que ejecuta la validación y el onSubmit. */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
            <LinearGradient colors={['#0B69A3', '#29C3A5']} style={styles.primaryButtonGradient}>
              <Text style={styles.primaryButtonText}>Registrar Cuenta</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón para volver al login. */}
          <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
            <Text style={styles.backToLoginText}>Volver al inicio</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Paleta de colores usada en esta pantalla.
const COLORS = {
  primary: '#0B69A3',
  accent: '#29C3A5',
  bg: '#F6FBFF',
  inputBorder: '#E1EEF7',
  text: '#0A2540',
  error: '#E02424',
};

// Estilos visuales de toda la pantalla.
const styles = StyleSheet.create({
  gradient: {
    flex: 1, // El fondo ocupa toda la pantalla.
  },
  container: {
    flexGrow: 1,              // Permite expandirse con el contenido.
    padding: 24,              // Espaciado interno.
    justifyContent: 'center', // Centra el contenido verticalmente.
  },
  logoContainer: {
    alignItems: 'center',     // Centra el logo.
    marginBottom: 15,         // Separación del resto.
  },
  logoBackground: {
    width: 130,
    height: 130,
    borderRadius: 100,        // Permite formar un círculo perfecto.
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',      // Sombra para dar relieve.
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,             // Sombra en Android.
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
    borderColor: COLORS.error, // Muestra bordes rojos cuando hay error.
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 8,
    fontSize: 13,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',       // Evita que el degradado se desborde.
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
