import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const TurnoListScreen = ({ navigation }) => {
  const [turnos, setTurnos] = useState([]);
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('fecha', 'asc'), orderBy('hora', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((docu) => items.push({ id: docu.id, ...docu.data() }));
        setTurnos(items);
      },
      (error) => {
        console.error('Error escuchando turnos: ', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Eliminar Turno', '¿Estás seguro de que quieres eliminar este turno?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'turnos', id));
            Alert.alert('Éxito', 'Turno eliminado correctamente.');
          } catch (error) {
            console.error('Error eliminando turno: ', error);
            Alert.alert('Error', 'No se pudo eliminar el turno.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <Button title="Agregar Nuevo Turno" onPress={() => navigation.navigate('AddTurno')} />
      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.nombrePaciente}</Text>
              <Text>Fecha: {item.fecha}</Text>
              <Text>Hora: {item.hora}</Text>
              <Text numberOfLines={1}>Motivo: {item.motivo}</Text>
            </View>
            <View style={styles.itemActions}>
              <Button title="Ver" onPress={() => navigation.navigate('DetailTurno', { turno: item })} />
              <View style={{ height: 6 }} />
              <Button title="Editar" onPress={() => navigation.navigate('EditTurno', { turno: item })} />
              <View style={{ height: 6 }} />
              <Button title="Borrar" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay turnos registrados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  itemInfo: { flex: 2 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  itemActions: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start' },
});

export default TurnoListScreen;
