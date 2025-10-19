// Es buena práctica importar React primero
import React, { useState } from 'react';
// Luego las cosas de react-native. Quitamos useEffect porque no se usa.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Contador() {
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };
  const reiniciarContador = () => {
    setContador(0);
  };

  return (
    // Es bueno agregar un View contenedor con flex: 1 y centrado para que se vea bien
    <View style={styles.container}>
      <Text style={styles.textoContador}>Contador: {contador}</Text>

      {/* REEMPLAZAMOS EL BUTTON POR UN TOUCHABLEOPACITY */}
      <TouchableOpacity style={styles.boton} onPress={incrementar}>
        <Text style={styles.textoBoton}>Incrementar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.boton} onPress={reiniciarContador}>
        <Text style={styles.textoBoton}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoContador: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boton: {
    // Agregamos un color de fondo para que el botón sea visible
    backgroundColor: 'tomato', 
    paddingVertical: 12,
    paddingHorizontal: 30, // Aumentado para más espacio
    borderRadius: 25, // Un poco más redondeado
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});