// src/components/BotonPersonalizado.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Alert } from 'react-native';

const BotonPersonalizado = ({  titulo, colorFondo }) => {
    const presionar = () => {
      Alert.alert("Hola", "Botón presionado!");
    };
  return (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: colorFondo || '#007bff' }]}
      onPress={presionar}
    >
      <Text style={styles.textoBoton}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BotonPersonalizado;