import React from 'react';
import { View, Button, TextInput, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { doc, updateDoc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const EditTurnoScreen = ({ route, navigation }) => {
  const { turno } = route.params || {};
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombrePaciente: turno?.nombrePaciente || '',
      fecha: turno?.fecha || '',
      hora: turno?.hora || '',
      motivo: turno?.motivo || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!data.fecha || !data.hora) {
        Alert.alert('Error', 'Fecha y hora son obligatorias.');
        return;
      }
      const fechaHoraISO = new Date(`${data.fecha}T${data.hora}:00`).toISOString();
      const payload = {
        nombrePaciente: data.nombrePaciente,
        fecha: data.fecha,
        hora: data.hora,
        fechaHora: fechaHoraISO,
        motivo: data.motivo,
        actualizadoEn: new Date().toISOString(),
      };

      if (!turno || !turno.id) {
        const docRef = await addDoc(collection(db, 'turnos'), {
          ...payload,
          creadoEn: new Date().toISOString(),
        });
        console.log('Documento creado con id:', docRef.id);
        Alert.alert('Creado', 'No se encontró el turno original; se creó uno nuevo con los cambios.');
        navigation.navigate('TurnoList');
        return;
      }

      const turnoDocRef = doc(db, 'turnos', turno.id);
      const snapshot = await getDoc(turnoDocRef);

      if (snapshot.exists()) {
        await updateDoc(turnoDocRef, payload);
        Alert.alert('Éxito', 'Turno actualizado correctamente.');
      } else {
        await setDoc(turnoDocRef, {
          ...payload,
          creadoEn: new Date().toISOString(),
        });
        Alert.alert('Aviso', 'El turno original no existía; se creó un nuevo documento con los cambios.');
      }

      navigation.navigate('TurnoList');
    } catch (error) {
      console.error('Error actualizando turno: ', error);
      Alert.alert('Error', `No se pudo actualizar el turno. ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.label}>Nombre del Paciente</Text>
      <Controller
        control={control}
        name="nombrePaciente"
        rules={{ required: 'El nombre es obligatorio.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} />
        )}
      />
      {errors.nombrePaciente && <Text style={styles.errorText}>{errors.nombrePaciente.message}</Text>}

      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <Controller
        control={control}
        name="fecha"
        rules={{
          required: 'La fecha es obligatoria.',
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD.' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} />
        )}
      />
      {errors.fecha && <Text style={styles.errorText}>{errors.fecha.message}</Text>}

      <Text style={styles.label}>Hora (HH:MM)</Text>
      <Controller
        control={control}
        name="hora"
        rules={{
          required: 'La hora es obligatoria.',
          pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:MM.' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} />
        )}
      />
      {errors.hora && <Text style={styles.errorText}>{errors.hora.message}</Text>}

      <Text style={styles.label}>Motivo</Text>
      <Controller
        control={control}
        name="motivo"
        rules={{ required: 'El motivo es obligatorio.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, { height: 90 }]} multiline onChangeText={onChange} value={value} />
        )}
      />
      {errors.motivo && <Text style={styles.errorText}>{errors.motivo.message}</Text>}

      <Button title="Guardar Cambios" onPress={handleSubmit(onSubmit)} />
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

export default EditTurnoScreen;
