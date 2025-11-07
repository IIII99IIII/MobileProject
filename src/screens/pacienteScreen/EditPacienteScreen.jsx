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

export default function EditPacienteScreen({ navigation, route }) {
  const { paciente, updatePaciente } = route.params;

  const scrollRef = useRef(null);

  const [nombre, setNombre] = React.useState(paciente.nombre);
  const [telefono, setTelefono] = React.useState(paciente.telefono);
  const [email, setEmail] = React.useState(paciente.email);
  const [edad, setEdad] = React.useState(paciente.edad);
  const [direccion, setDireccion] = React.useState(paciente.direccion);

  const inputRefs = {
    nombre: useRef(null),
    telefono: useRef(null),
    email: useRef(null),
    edad: useRef(null),
    direccion: useRef(null),
  };

  const handleFocus = (refName) => {
    const scrollNode = findNodeHandle(scrollRef.current);
    const inputNode = findNodeHandle(inputRefs[refName].current);

    if (scrollNode && inputNode) {
      UIManager.measureLayout(
        inputNode,
        scrollNode,
        () => {},
        (x, y) => {
          scrollRef.current.scrollTo({ y: y - 100, animated: true });
        }
      );
    }
  };

  const handleUpdate = () => {
    if (!nombre.trim()) return alert('Ingrese un nombre');

    const pacienteActualizado = { ...paciente, nombre, telefono, email, edad, direccion };
    updatePaciente(pacienteActualizado);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar Paciente</Text>

          {/* Nombre */}
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

          {/* Teléfono */}
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

          {/* Email */}
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

          {/* Edad */}
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

          {/* Dirección */}
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

          {/* Botón actualizar */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Actualizar Paciente</Text>
          </TouchableOpacity>

          {/* Botón volver */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color="#007ACC" />
            <Text style={styles.backText}>Volver a Pacientes</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

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
