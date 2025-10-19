// src/screens/DetailsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BotonPersonalizado from '../../components/botonPersonalizado/BotonPersonalizado';

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pestaña de Detalles</Text>
      <Text style={styles.subtext}>Este es el contenido de la sección de detalles.</Text>
      <BotonPersonalizado
        titulo="Boton en Detalles"
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
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,

  },
  subtext: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  }
});

export default DetailsScreen;