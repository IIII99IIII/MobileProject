import React from 'react';
import { View, TextInput, StyleSheet, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const COLORS = {
  primary: '#0B69A3',
  accent: '#29C3A5',
  bg: '#F6FBFF',
  inputBorder: '#E1EEF7',
  text: '#0A2540',
  error: '#E02424',
};

const AddTurnoScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { nombrePaciente: '', fecha: '', hora: '', motivo: '' },
  });

  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'turnos'), {
        nombrePaciente: data.nombrePaciente.trim(),
        fecha: data.fecha.trim(),
        hora: data.hora.trim(),
        motivo: data.motivo.trim(),
        creadoEn: new Date().toISOString(),
      });
      Alert.alert('Éxito', 'Turno añadido correctamente.');
      navigation.navigate('TurnoList');
    } catch (error) {
      console.error('Error añadiendo turno: ', error);
      Alert.alert('Error', 'No se pudo añadir el turno.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.header}>Agregar Turno</Text>

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

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.primaryButtonText}>Guardar Turno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.bg },
  header: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginBottom: 8 },
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
