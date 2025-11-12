import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';
import { COLORS } from '../../theme/colors';

// Muestra la info de un turno y ofrece navegar a edición
const DetailTurnoScreen = ({ route, navigation }) => {
  // Recibe 'turno' por parámetros de navegación
  const { turno } = route.params || {};
  // Lee insets para calcular padding inferior
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  // Si no viene el turno, muestra fallback
  if (!turno) {
    return (
      <View style={[styles.center, { paddingBottom: bottomPad }]}>
        <Text style={{ color: COLORS.textMain }}>No se encontró el turno.</Text>
      </View>
    );
  }

  // Renderiza la tarjeta con datos y botón Editar
  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.title}>{turno.nombrePaciente}</Text>
      <View style={styles.card}>
        <Text style={styles.line}><Text style={styles.label}>Fecha:</Text> {turno.fecha}</Text>
        <Text style={styles.line}><Text style={styles.label}>Hora:</Text> {turno.hora}</Text>
        <Text style={styles.line}><Text style={styles.label}>Motivo:</Text> {turno.motivo}</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('EditTurno', { turno })}>
        <Text style={styles.primaryButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos unificados
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.bgSoft, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgSoft },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: COLORS.primaryDark, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: { color: COLORS.primary, fontWeight: '700' },
  line: { fontSize: 16, marginBottom: 8, color: COLORS.textMain },
  primaryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default DetailTurnoScreen;
