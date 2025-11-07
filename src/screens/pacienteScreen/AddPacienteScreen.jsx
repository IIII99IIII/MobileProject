import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
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

export default function AddPacienteScreen({ navigation, route }) {
  const { addPaciente } = route.params || {};
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [direccion, setDireccion] = useState('');

  const scrollRef = useRef(null);
  const inputRefs = {
    nombre: useRef(null),
    telefono: useRef(null),
    email: useRef(null),
    edad: useRef(null),
    direccion: useRef(null),
  };

  const handleAdd = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingrese un nombre');
      return;
    }

    const nuevoPaciente = {
      id: Date.now(),
      nombre,
      telefono,
      email,
      edad,
      direccion,
    };

    if (addPaciente) addPaciente(nuevoPaciente);
    navigation.goBack();
  };

  // ✅ Mueve el scroll al enfocar cada input
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* Cierra el teclado al tocar fuera */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
              <Ionicons name="person-add-outline" size={32} color="#007ACC" />
              <View>
                <Text style={styles.titulo}>Nuevo Paciente</Text>
                <Text style={styles.subtitulo}>Complete la información</Text>
              </View>
            </View>

            {/* Campo: Nombre */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#007ACC" />
              <TextInput
                ref={inputRefs.nombre}
                style={styles.input}
                placeholder="Nombre completo"
                value={nombre}
                onFocus={() => handleFocus('nombre')}
                onChangeText={setNombre}
                placeholderTextColor="#999"
              />
            </View>

            {/* Campo: Teléfono */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#007ACC" />
              <TextInput
                ref={inputRefs.telefono}
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={telefono}
                onFocus={() => handleFocus('telefono')}
                onChangeText={setTelefono}
                placeholderTextColor="#999"
              />
            </View>

            {/* Campo: Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#007ACC" />
              <TextInput
                ref={inputRefs.email}
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onFocus={() => handleFocus('email')}
                onChangeText={setEmail}
                placeholderTextColor="#999"
              />
            </View>

            {/* Campo: Edad */}
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#007ACC" />
              <TextInput
                ref={inputRefs.edad}
                style={styles.input}
                placeholder="Edad"
                keyboardType="numeric"
                value={edad}
                onFocus={() => handleFocus('edad')}
                onChangeText={setEdad}
                placeholderTextColor="#999"
              />
            </View>

            {/* Campo: Dirección */}
            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={20} color="#007ACC" />
              <TextInput
                ref={inputRefs.direccion}
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onFocus={() => handleFocus('direccion')}
                onChangeText={setDireccion}
                placeholderTextColor="#999"
              />
            </View>

            {/* Botón principal */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.buttonText}>Agregar Paciente</Text>
            </TouchableOpacity>

            {/* Botón volver */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={20} color="#007ACC" />
              <Text style={styles.backText}>Volver a Pacientes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#EAF4FC',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004B8D',
  },
  subtitulo: {
    color: '#007ACC',
    fontSize: 14,
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
