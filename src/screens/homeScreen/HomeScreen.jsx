import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BotonPersonalizado from '../../components/botonPersonalizado/BotonPersonalizado';


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pestaña de Inicio</Text>
      <Text style={styles.subtitulo}>Este es el contenido de Home.</Text>

        <BotonPersonalizado
          titulo="Boton en Inicio"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
});

export default HomeScreen;