import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 📋 Pantalla de detalle del paciente
export default function DetailPacienteScreen({ navigation, route }) {
  // Se recibe el objeto 'paciente' desde la ruta (params)
  const { paciente } = route.params;

  return (
    // ScrollView permite desplazarse si el contenido es largo
    <ScrollView contentContainerStyle={styles.container}>

      {/* 🔹 Tarjeta principal con la información del paciente */}
      <View style={styles.card}>
        {/* Ícono del perfil del paciente */}
        <Ionicons name="person-circle-outline" size={60} color="#007ACC" style={styles.icon} />

        {/* Título de la sección */}
        <Text style={styles.titulo}>Detalles del Paciente</Text>

        {/* 🔸 Fila: Nombre */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{paciente.nombre}</Text>
        </View>

        {/* 🔸 Fila: Teléfono */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{paciente.telefono || 'No especificado'}</Text>
        </View>

        {/* 🔸 Fila: Email */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{paciente.email || 'No especificado'}</Text>
        </View>

        {/* 🔸 Fila: Edad */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{paciente.edad || 'No especificado'}</Text>
        </View>

        {/* 🔸 Fila: Dirección */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>{paciente.direccion || 'No especificado'}</Text>
        </View>
      </View>

      {/* 🔙 Botón para volver a la pantalla anterior */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Volver a Pacientes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🎨 Estilos visuales del componente
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    padding: 20,
    backgroundColor: '#EAF4FC',
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Tarjeta de datos del paciente
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },

  // Ícono de persona
  icon: {
    marginBottom: 10,
  },

  // Título principal
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004B8D',
    marginBottom: 15,
  },

  // Cada fila de información (label + valor)
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // Etiqueta (por ejemplo: "Nombre:")
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007ACC',
  },

  // Valor (por ejemplo: "Juan Pérez")
  value: {
    fontSize: 16,
    color: '#333',
  },

  // Botón de volver
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007ACC',
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  // Texto dentro del botón de volver
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
