import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const DetailTurnoScreen = ({ route, navigation }) => {
  const { turno } = route.params || {};
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  if (!turno) {
    return (
      <View style={[styles.center, { paddingBottom: bottomPad }]}>
        <Text>No se encontró el turno.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
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
