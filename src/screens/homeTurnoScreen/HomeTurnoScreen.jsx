import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const HomeTurnoScreen = ({ navigation }) => {
  const [proximos, setProximos] = useState([]);
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24; // espacio para no tapar contenido
  const fabBottom = TAB_HEIGHT + insets.bottom + 26; // un poco arriba de la barra

  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('fecha', 'asc'), orderBy('hora', 'asc'), limit(5));
    const unsubscribe = onSnapshot(q, (qs) => {
      const arr = [];
      qs.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setProximos(arr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <Text style={styles.titulo}>Bienvenida Dra. — Agenda Odontológica</Text>
      <Text style={styles.subtitulo}>Próximos turnos</Text>

      <FlatList
        data={proximos}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.turno} onPress={() => navigation.navigate('DetailTurno', { turno: item })}>
            <Text style={styles.nombre}>{item.nombrePaciente}</Text>
            <Text>{item.fecha}  •  {item.hora}</Text>
            <Text numberOfLines={1} style={styles.motivo}>{item.motivo}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 8 }}>No hay turnos programados.</Text>}
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: fabBottom }]} onPress={() => navigation.navigate('AddTurno')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitulo: { color: 'gray', marginBottom: 12 },
  turno: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, elevation: 1 },
  nombre: { fontWeight: '700', fontSize: 16 },
  motivo: { color: '#666', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: 'bold' }
});

export default HomeTurnoScreen;
