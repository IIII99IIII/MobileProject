import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// Firestore: lectura en tiempo real y delete
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';
import { COLORS } from '../../theme/colors';

// Lista completa de turnos con acciones Ver/Editar/Eliminar
const TurnoListScreen = ({ navigation }) => {
  // Estado local de turnos
  const [turnos, setTurnos] = useState([]);
  // Ajuste de padding inferior con insets + altura barra
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  // Suscripción en tiempo real ordenada por fecha y hora
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

  // Elimina un turno por id, con confirmación
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

  // Render principal
  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {/* Cabecera con título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Lista de Turnos</Text>
      </View>

      {/* Botón para ir a pantalla de alta */}
      <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('AddTurno')}>
        <Text style={styles.btnText}>➕ Agregar Nuevo Turno</Text>
      </TouchableOpacity>

      {/* Lista de ítems */}
      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* Información del turno */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.nombrePaciente}</Text>
              <Text style={styles.itemDetail}>Fecha: {item.fecha}</Text>
              <Text style={styles.itemDetail}>Hora: {item.hora}</Text>
              <Text style={styles.itemDetail} numberOfLines={1}>Motivo: {item.motivo}</Text>
            </View>

            {/* Acciones a la derecha */}
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.btnSmall, styles.btnOutline]}
                onPress={() => navigation.navigate('DetailTurno', { turno: item })}
              >
                <Text style={styles.btnOutlineText}>Ver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSmall, styles.btnOutline]}
                onPress={() => navigation.navigate('EditTurno', { turno: item })}
              >
                <Text style={styles.btnOutlineText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSmall, styles.btnDanger]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay turnos registrados.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

// Estilos con paleta unificada
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgSoft },
  header: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 10, marginBottom: 16 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  itemInfo: { flex: 2 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: 4 },
  itemDetail: { color: COLORS.textMain, marginBottom: 2 },

  itemActions: { flex: 1, alignItems: 'flex-end', justifyContent: 'space-around', gap: 6 },

  btn: { padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 14, elevation: 2 },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnDanger: { backgroundColor: COLORS.danger },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  btnSmall: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, minWidth: 90, alignItems: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  btnOutlineText: { color: COLORS.primary, fontWeight: '700' },

  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
});

export default TurnoListScreen;
