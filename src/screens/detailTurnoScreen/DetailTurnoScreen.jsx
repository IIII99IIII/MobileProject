// Importa React para crear componentes funcionales.
import React from 'react';
// Importa componentes base de React Native para construir la UI.
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Hook que permite leer los márgenes seguros (safe areas) como el del notch.
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Altura de la barra inferior personalizada (de la navegación principal).
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';
// Colores centralizados desde el theme del proyecto.
import { COLORS } from '../../theme/colors';

// Componente que muestra la información detallada de un turno.
// Recibe 'route' para leer parámetros y 'navigation' para moverse entre pantallas.
const DetailTurnoScreen = ({ route, navigation }) => {

  // Extrae el objeto 'turno' recibido por navegación (ej: desde TurnoList o HomeTurno).
  const { turno } = route.params || {};

  // Obtiene los márgenes seguros para evitar que algo quede detrás del notch o la barra inferior.
  const insets = useSafeAreaInsets();

  // Calcula padding inferior combinando la altura del TabBar + el inset real + 24px extra.
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  // Si por algún motivo NO llega un turno, muestra un mensaje de error simple.
  if (!turno) {
    return (
      <View style={[styles.center, { paddingBottom: bottomPad }]}>
        <Text style={{ color: COLORS.textMain }}>No se encontró el turno.</Text>
      </View>
    );
  }

  // Si el turno SÍ existe, renderiza los datos dentro de una tarjeta.
  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>

      {/* Nombre del paciente como título principal */}
      <Text style={styles.title}>{turno.nombrePaciente}</Text>

      {/* Tarjeta con los datos principales del turno */}
      <View style={styles.card}>
        <Text style={styles.line}>
          <Text style={styles.label}>Fecha:</Text> {turno.fecha}
        </Text>

        <Text style={styles.line}>
          <Text style={styles.label}>Hora:</Text> {turno.hora}
        </Text>

        <Text style={styles.line}>
          <Text style={styles.label}>Motivo:</Text> {turno.motivo}
        </Text>
      </View>

      {/* Botón para navegar a la pantalla de edición, enviando el turno actual */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('EditTurno', { turno })}
      >
        <Text style={styles.primaryButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos visuales del componente, utilizando la paleta global unificada COLORS.
const styles = StyleSheet.create({
  // Contenedor principal con padding y fondo suave.
  container: {
    padding: 20,
    backgroundColor: COLORS.bgSoft,
    flex: 1,
  },

  // Vista centrada para cuando no se encuentra información.
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgSoft,
  },

  // Estilo del título con el nombre del paciente.
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },

  // Tarjeta con sombra y bordes suaves para mostrar los datos.
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

  // Estilo de las etiquetas (ej: "Fecha:", "Hora:").
  label: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Estilo de cada línea de información.
  line: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textMain,
  },

  // Botón principal para editar el turno.
  primaryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },

  // Texto del botón de edición.
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

// Exporta el componente para usarlo en la navegación.
export default DetailTurnoScreen;
