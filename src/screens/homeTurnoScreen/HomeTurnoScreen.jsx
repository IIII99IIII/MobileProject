// src/screens/homeTurnoScreen/HomeTurnoScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { TAB_HEIGHT } from '../../navigation/MainPagerTabs';

const HomeTurnoScreen = ({ navigation }) => {
  const [proximos, setProximos] = useState([]);
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_HEIGHT + insets.bottom + 24;

  useEffect(() => {
    const q = query(
      collection(db, 'turnos'),
      orderBy('fecha', 'asc'),
      orderBy('hora', 'asc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (qs) => {
      const arr = [];
      qs.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setProximos(arr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {/* Encabezado con bienvenida */}
      <View style={styles.header}>
        <Ionicons name="medkit-outline" size={30} color="#007ACC" />
        <View>
          <Text style={styles.bienvenida}>Bienvenida Dra.</Text>
          <Text style={styles.titulo}>Agenda Odontológica</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>Próximos turnos</Text>

      {/* Lista de turnos */}
      <FlatList
        data={proximos}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.turno}
            onPress={() => navigation.navigate('DetailTurno', { turno: item })}
          >
            <View style={styles.turnoHeader}>
              <MaterialIcons name="person-outline" size={20} color="#007ACC" />
              <Text style={styles.nombre}>{item.nombrePaciente}</Text>
            </View>
            <View style={styles.turnoInfo}>
              <Ionicons name="time-outline" size={16} color="#555" />
              <Text style={styles.textoInfo}>
                {item.fecha} • {item.hora}
              </Text>
            </View>
            <View style={styles.turnoInfo}>
              <Ionicons name="clipboard-outline" size={16} color="#555" />
              <Text numberOfLines={1} style={styles.motivo}>
                {item.motivo}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay turnos programados.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF4FC', // Fondo celeste suave
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bienvenida: {
    fontSize: 16,
    color: '#007ACC',
    fontWeight: '600',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004B8D',
  },
  subtitulo: {
    color: '#007ACC',
    fontWeight: '500',
    marginBottom: 12,
  },
  turno: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  turnoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  turnoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  nombre: {
    fontWeight: '700',
    fontSize: 16,
    color: '#004B8D',
  },
  textoInfo: {
    color: '#333',
    fontSize: 14,
  },
  motivo: {
    color: '#666',
    fontSize: 14,
    flexShrink: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default HomeTurnoScreen;
