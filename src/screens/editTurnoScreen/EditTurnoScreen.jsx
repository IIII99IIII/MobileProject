import React from 'react';
import { View, Button, TextInput, StyleSheet, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
// Firestore: CRUD
import { doc, updateDoc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';
import { COLORS } from '../../theme/colors';

// Pantalla para editar (o crear si falta id) un turno
const EditTurnoScreen = ({ route, navigation }) => {
  // Recibe turno por params
  const { turno } = route.params || {};
  // Calcula padding inferior
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  // Carga valores iniciales del form desde turno o vacíos
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombrePaciente: turno?.nombrePaciente || '',
      fecha: turno?.fecha || '',
      hora: turno?.hora || '',
      motivo: turno?.motivo || '',
    },
  });

  // Envío del formulario
  const onSubmit = async (data) => {
    try {
      // Validación defensiva: fecha/hora requeridas (además de las reglas)
      if (!data.fecha || !data.hora) {
        Alert.alert('Error', 'Fecha y hora son obligatorias.');
        return;
      }
      // Genera un ISO combinando fecha y hora (útil para ordenar/consultas futuras)
      const fechaHoraISO = new Date(`${data.fecha}T${data.hora}:00`).toISOString();

      // Payload final a guardar
      const payload = {
        nombrePaciente: data.nombrePaciente,
        fecha: data.fecha,
        hora: data.hora,
        fechaHora: fechaHoraISO,
        motivo: data.motivo,
        actualizadoEn: new Date().toISOString(),
      };

      // Si no vino turno o no tiene id, crea un documento nuevo
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

      // Si hay id, intenta actualizar el documento existente
      const turnoDocRef = doc(db, 'turnos', turno.id);
      const snapshot = await getDoc(turnoDocRef);

      if (snapshot.exists()) {
        await updateDoc(turnoDocRef, payload);
        Alert.alert('Éxito', 'Turno actualizado correctamente.');
      } else {
        // Si el doc no existía, lo crea explícitamente con el id (setDoc)
        await setDoc(turnoDocRef, {
          ...payload,
          creadoEn: new Date().toISOString(),
        });
        Alert.alert('Aviso', 'El turno original no existía; se creó un nuevo documento con los cambios.');
      }

      // Vuelve a la lista
      navigation.navigate('TurnoList');
    } catch (error) {
      console.error('Error actualizando turno: ', error);
      Alert.alert('Error', `No se pudo actualizar el turno. ${error.message}`);
    }
  };

  // Render con formulario controlado
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.title}>Editar Turno</Text>

      {/* Nombre */}
      <Text style={styles.label}>Nombre del Paciente</Text>
      <Controller
        control={control}
        name="nombrePaciente"
        rules={{ required: 'El nombre es obligatorio.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, errors.nombrePaciente && styles.inputError]} onChangeText={onChange} value={value} />
        )}
      />
      {errors.nombrePaciente && <Text style={styles.errorText}>{errors.nombrePaciente.message}</Text>}

      {/* Fecha */}
      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <Controller
        control={control}
        name="fecha"
        rules={{
          required: 'La fecha es obligatoria.',
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD.' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, errors.fecha && styles.inputError]} onChangeText={onChange} value={value} />
        )}
      />
      {errors.fecha && <Text style={styles.errorText}>{errors.fecha.message}</Text>}

      {/* Hora */}
      <Text style={styles.label}>Hora (HH:MM)</Text>
      <Controller
        control={control}
        name="hora"
        rules={{
          required: 'La hora es obligatoria.',
          pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Formato HH:MM.' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, errors.hora && styles.inputError]} onChangeText={onChange} value={value} />
        )}
      />
      {errors.hora && <Text style={styles.errorText}>{errors.hora.message}</Text>}

      {/* Motivo */}
      <Text style={styles.label}>Motivo</Text>
      <Controller
        control={control}
        name="motivo"
        rules={{ required: 'El motivo es obligatorio.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, { height: 90 }, errors.motivo && styles.inputError]} multiline onChangeText={onChange} value={value} />
        )}
      />
      {errors.motivo && <Text style={styles.errorText}>{errors.motivo.message}</Text>}

      {/* Guardar */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.bgSoft },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: 16, textAlign: 'center' },
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
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, marginBottom: 12 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    marginTop: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default EditTurnoScreen;
