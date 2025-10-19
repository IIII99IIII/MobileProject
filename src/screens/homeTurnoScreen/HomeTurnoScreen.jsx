// src/screens/homeTurnoScreen/HomeTurnoScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import BotonPersonalizado from '../../components/botonPersonalizado/BotonPersonalizado';

const HomeTurnoScreen = ({ navigation }) => {
  const [proximos, setProximos] = useState([]);

  useEffect(() => {
    // mostramos los próximos 5 turnos ordenados por fecha y hora
    const q = query(collection(db, 'turnos'), orderBy('fecha', 'asc'), orderBy('hora', 'asc'), limit(5));
    const unsubscribe = onSnapshot(q, (qs) => {
      const arr = [];
      qs.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setProximos(arr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
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

      <View style={{ marginTop: 20 }}>
        <Button title="Agregar Turno" onPress={() => navigation.navigate('AddTurno')} />
      </View>

      <View style={{ marginTop: 16 }}>
        <BotonPersonalizado titulo="Ver Agenda Completa" colorFondo="#28a745" onPress={() => navigation.navigate('TurnoList')} />
      </View>
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
});

export default HomeTurnoScreen;
