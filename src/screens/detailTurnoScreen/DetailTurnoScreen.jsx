// src/screens/detailTurnoScreen/DetailTurnoScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const DetailTurnoScreen = ({ route, navigation }) => {
  const { turno } = route.params || {};

  if (!turno) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el turno.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{turno.nombrePaciente}</Text>
      <Text style={styles.line}>Fecha: {turno.fecha}</Text>
      <Text style={styles.line}>Hora: {turno.hora}</Text>
      <Text style={styles.line}>Motivo: {turno.motivo}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Editar" onPress={() => navigation.navigate('EditTurno', { turno })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  line: { fontSize: 16, marginBottom: 6 },
});

export default DetailTurnoScreen;
