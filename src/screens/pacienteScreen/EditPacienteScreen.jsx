import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

// 📋 Pantalla para editar los datos de un paciente
export default function EditPacienteScreen({ navigation, route }) {
  // Se reciben los datos del paciente y la función para actualizarlo desde la navegación
  const { paciente, updatePaciente } = route.params;

  // Referencia del ScrollView para hacer scroll automático cuando se enfoca un campo
  const scrollRef = useRef(null);

  // Estados locales para los campos del formulario
  const [nombre, setNombre] = React.useState(paciente.nombre);
  const [telefono, setTelefono] = React.useState(paciente.telefono);
  const [email, setEmail] = React.useState(paciente.email);
  const [edad, setEdad] = React.useState(paciente.edad);
  const [direccion, setDireccion] = React.useState(paciente.direccion);

  // Refs individuales para cada campo (para calcular posición al enfocar)
  const inputRefs = {
    nombre: useRef(null),
    telefono: useRef(null),
    email: useRef(null),
    edad: useRef(null),
    direccion: useRef(null),
  };

  // 📌 Cuando un input recibe foco, se hace scroll automático para que quede visible
  const handleFocus = (refName) => {
    const scrollNode = findNodeHandle(scrollRef.current);
    const inputNode = findNodeHandle(inputRefs[refName].current);

    if (scrollNode && inputNode) {
      UIManager.measureLayout(
        inputNode,
        scrollNode,
        () => {}, // callback en caso de error
        (x, y) => {
          // Desplaza el scroll para que el input quede visible
          scrollRef.current.scrollTo({ y: y - 100, animated: true });
        }
      );
    }
  };

  // 💾 Función que guarda los cambios hechos al paciente
  const handleUpdate = () => {
    if (!nombre.trim()) return alert('Ingrese un nombre');

    // Se crea un nuevo objeto con los datos actualizados
    const pacienteActualizado = { ...paciente, nombre, telefono, email, edad, direccion };

    // Se llama a la función que actualiza al paciente en la lista principal
    updatePaciente(pacienteActualizado);

    // Regresa a la pantalla anterior
    navigation.goBack();
  };

  return (
    // 📱 Evita que el teclado tape los campos en iOS y Android
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* Cierra el teclado si el usuario toca fuera del campo */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar Paciente</Text>

          {/* 🔹 Campo: Nombre */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#007ACC" />
            <TextInput
              ref={inputRefs.nombre}
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              onFocus={() => handleFocus('nombre')}
            />
          </View>

          {/* 🔹 Campo: Teléfono */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#007ACC" />
            <TextInput
              ref={inputRefs.telefono}
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              onFocus={() => handleFocus('telefono')}
            />
          </View>

          {/* 🔹 Campo: Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#007ACC" />
            <TextInput
              ref={inputRefs.email}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              onFocus={() => handleFocus('email')}
            />
          </View>

          {/* 🔹 Campo: Edad */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#007ACC" />
            <TextInput
              ref={inputRefs.edad}
              style={styles.input}
              value={edad}
              onChangeText={setEdad}
              placeholder="Edad"
              keyboardType="numeric"
              placeholderTextColor="#999"
              onFocus={() => handleFocus('edad')}
            />
          </View>

          {/* 🔹 Campo: Dirección */}
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#007ACC" />
            <TextInput
              ref={inputRefs.direccion}
              style={styles.input}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección"
              placeholderTextColor="#999"
              onFocus={() => handleFocus('direccion')}
            />
          </View>

          {/* ✅ Botón para guardar los cambios */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Actualizar Paciente</Text>
          </TouchableOpacity>

          {/* 🔙 Botón para volver sin guardar */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color="#007ACC" />
            <Text style={styles.backText}>Volver a Pacientes</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#EAF4FC',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004B8D',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCE5FF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007ACC',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backText: {
    color: '#007ACC',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
  },
});
