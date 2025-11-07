import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Lista de Turnos</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, styles.btnGreen]}
        onPress={() => navigation.navigate('AddTurno')}
      >
        <Text style={styles.btnText}>➕ Agregar Nuevo Turno</Text>
      </TouchableOpacity>

      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.nombrePaciente}</Text>
              <Text style={styles.itemDetail}>Fecha: {item.fecha}</Text>
              <Text style={styles.itemDetail}>Hora: {item.hora}</Text>
              <Text style={styles.itemDetail} numberOfLines={1}>
                Motivo: {item.motivo}
              </Text>
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.btnSmall, styles.btnBlue]}
                onPress={() => navigation.navigate('DetailTurno', { turno: item })}
              >
                <Text style={styles.btnText}>Ver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSmall, styles.btnBlue]}
                onPress={() => navigation.navigate('EditTurno', { turno: item })}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSmall, styles.btnRed]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay turnos registrados.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#2e7d9d',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#2e7d9d',
  },
  itemInfo: { flex: 2 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d9d', marginBottom: 4 },
  itemDetail: { color: '#555', marginBottom: 2 },

  itemActions: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: 6,
  },

  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },
  btnSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },

  btnGreen: { backgroundColor: '#4caf50' },
  btnGray: { backgroundColor: '#9e9e9e' },
  btnBlue: { backgroundColor: '#1976d2' },
  btnRed: { backgroundColor: '#d32f2f' },

  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
});

export default TurnoListScreen;
