// src/screens/addTurnoScreen/AddTurnoScreen.jsx
import React from 'react';
import { View, Button, TextInput, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const AddTurnoScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { nombrePaciente: '', fecha: '', hora: '', motivo: '' }
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'turnos'), {
        nombrePaciente: data.nombrePaciente,
        fecha: data.fecha,
        hora: data.hora,
        motivo: data.motivo,
        creadoEn: new Date().toISOString()
      });
      Alert.alert("Éxito", "Turno añadido correctamente.");
      // Lleva al listado completo para que se vea inmediatamente la agenda completa
      navigation.navigate('TurnoList');
    } catch (error) {
      console.error("Error añadiendo turno: ", error);
      Alert.alert("Error", "No se pudo añadir el turno.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre del Paciente</Text>
      <Controller
        control={control}
        name="nombrePaciente"
        rules={{ required: 'El nombre del paciente es obligatorio.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ej: María López"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato de fecha inválido. Usa YYYY-MM-DD.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="2025-10-19"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
          pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato de hora inválido. Usa HH:MM.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="14:30"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
            style={[styles.input, { height: 90 }]}
            placeholder="Ej: Limpieza, empaste, extracción, ortodoncia..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
          />
        )}
      />
      {errors.motivo && <Text style={styles.errorText}>{errors.motivo.message}</Text>}

      <Button title="Guardar Turno" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: { color: 'red', marginBottom: 12 },
});

export default AddTurnoScreen;
