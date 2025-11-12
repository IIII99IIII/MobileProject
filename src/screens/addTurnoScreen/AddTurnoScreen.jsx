import React from 'react';
import { View, TextInput, StyleSheet, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
// Insets seguros para calcular padding inferior (por la barra).
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Gestión de formularios controlados.
import { useForm, Controller } from 'react-hook-form';
// Firestore: colección y addDoc para crear documentos.
import { collection, addDoc } from 'firebase/firestore';
// Instancia de DB configurada.
import { db } from '../../../firebaseConfig';
// Altura de la barra para calcular padding inferior.
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';
// Paleta unificada
import { COLORS } from '../../theme/colors';

// Componente de alta de turnos
const AddTurnoScreen = ({ navigation }) => {
  // Configura el formulario con valores por defecto y validación declarativa
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { nombrePaciente: '', fecha: '', hora: '', motivo: '' },
  });

  // Lee insets del dispositivo
  const insets = useSafeAreaInsets();
  // Calcula padding inferior para evitar solaparse con la barra inferior custom
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  // Handler del envío del formulario válido
  const onSubmit = async (data) => {
    try {
      // Crea un documento en la colección 'turnos' con campos normalizados (trim)
      await addDoc(collection(db, 'turnos'), {
        nombrePaciente: data.nombrePaciente.trim(),
        fecha: data.fecha.trim(),
        hora: data.hora.trim(),
        motivo: data.motivo.trim(),
        creadoEn: new Date().toISOString(), // timestamp ISO de creación
      });
      // Notifica éxito
      Alert.alert('Éxito', 'Turno añadido correctamente.');
      // Regresa a la lista de turnos
      navigation.navigate('TurnoList');
    } catch (error) {
      // Log y alerta de error genérico
      console.error('Error añadiendo turno: ', error);
      Alert.alert('Error', 'No se pudo añadir el turno.');
    }
  };

  // Render con ScrollView (evita que el teclado tape inputs)
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.header}>Agregar Turno</Text>

      {/* Campo: Nombre del Paciente */}
      <Text style={styles.label}>Nombre del Paciente</Text>
      <Controller
        control={control}
        name="nombrePaciente"
        rules={{ required: 'El nombre del paciente es obligatorio.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.nombrePaciente && styles.inputError]}
            placeholder="Ej: María López"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.nombrePaciente && <Text style={styles.errorText}>{errors.nombrePaciente.message}</Text>}

      {/* Campo: Fecha (YYYY-MM-DD) */}
      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <Controller
        control={control}
        name="fecha"
        rules={{
          required: 'La fecha es obligatoria.',
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato de fecha inválido. Usa YYYY-MM-DD.' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.fecha && styles.inputError]}
            placeholder="2025-11-05"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.fecha && <Text style={styles.errorText}>{errors.fecha.message}</Text>}

      {/* Campo: Hora (HH:MM) */}
      <Text style={styles.label}>Hora (HH:MM)</Text>
      <Controller
        control={control}
        name="hora"
        rules={{
          required: 'La hora es obligatoria.',
          pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato de hora inválido. Usa HH:MM.' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.hora && styles.inputError]}
            placeholder="14:30"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.hora && <Text style={styles.errorText}>{errors.hora.message}</Text>}

      {/* Campo: Motivo */}
      <Text style={styles.label}>Motivo de la Consulta</Text>
      <Controller
        control={control}
        name="motivo"
        rules={{ required: 'El motivo es obligatorio.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }, errors.motivo && styles.inputError]}
            placeholder="Limpieza, empaste, extracción, ortodoncia..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
            placeholderTextColor="#9FBFD9"
          />
        )}
      />
      {errors.motivo && <Text style={styles.errorText}>{errors.motivo.message}</Text>}

      {/* Botón: dispara handleSubmit que valida y llama a onSubmit */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.primaryButtonText}>Guardar Turno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos con la paleta unificada
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.bgSoft },
  header: { fontSize: 22, fontWeight: '700', color: COLORS.primaryDark, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.textMain,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, marginBottom: 8 },
  primaryButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default AddTurnoScreen;
