// ✅ Pantalla que muestra la lista de pacientes, con menú tipo hamburguesa en cada tarjeta

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default function PacienteListScreen({ navigation }) {
  // 🧠 Estado local que guarda todos los pacientes almacenados
  const [pacientes, setPacientes] = useState([]);

  // ⚙️ Carga los pacientes desde AsyncStorage al iniciar la pantalla
  useEffect(() => {
    cargarPacientes();
  }, []);

  // 🔹 Función que obtiene los pacientes almacenados en memoria local (AsyncStorage)
  const cargarPacientes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@pacientes');
      if (jsonValue != null) setPacientes(JSON.parse(jsonValue)); // Si hay datos, los carga al estado
    } catch (e) {
      console.error('Error al cargar pacientes', e);
    }
  };

  // 💾 Guarda la lista de pacientes actualizada en AsyncStorage
  const guardarPacientes = async (nuevosPacientes) => {
    try {
      await AsyncStorage.setItem('@pacientes', JSON.stringify(nuevosPacientes));
      setPacientes(nuevosPacientes);
    } catch (e) {
      console.error('Error al guardar pacientes', e);
    }
  };

  // ➕ Agrega un nuevo paciente a la lista
  const addPaciente = (nuevoPaciente) => {
    const updated = [...pacientes, nuevoPaciente];
    guardarPacientes(updated);

    // ✅ Muestra un mensaje tipo “toast” al agregar con éxito
    Toast.show('✅ Paciente agregado con éxito', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#1e90ff',
      textColor: '#fff',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  // 🔄 Actualiza un paciente existente
  const updatePaciente = (pacienteActualizado) => {
    const updated = pacientes.map(p =>
      p.id === pacienteActualizado.id ? pacienteActualizado : p
    );
    guardarPacientes(updated);
  };

  // ❌ Elimina un paciente con confirmación previa
  const deletePaciente = (id) => {
    Alert.alert(
      'Eliminar paciente',
      '¿Seguro que quieres eliminar este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Filtra la lista quitando el paciente seleccionado
            const updated = pacientes.filter(p => p.id !== id);
            guardarPacientes(updated);

            // 🔔 Notificación visual del borrado
            Toast.show('🗑️ Paciente eliminado', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              backgroundColor: '#ff4d4d',
              textColor: '#fff',
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Encabezado con ícono y título */}
      <View style={styles.header}>
        <Icon name="groups" size={28} color="#1e90ff" />
        <Text style={styles.headerText}>Lista de Pacientes</Text>
      </View>

      {/* 🔸 Si no hay pacientes registrados */}
      {pacientes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="sentiment-dissatisfied" size={70} color="#ccc" />
          <Text style={styles.emptyText}>No hay pacientes registrados</Text>
          <Text style={styles.emptySubText}>Toca el botón + para agregar uno nuevo</Text>
        </View>
      ) : (
        // 🔹 Si hay pacientes, los muestra en una lista
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* 🧍 Izquierda: ícono y nombre del paciente */}
              <View style={styles.cardLeft}>
                <Icon name="person" size={30} color="#1e90ff" style={{ marginRight: 10 }} />
                <Text style={styles.nombre} numberOfLines={1} ellipsizeMode="tail">
                  {item.nombre}
                </Text>
              </View>

              {/* ☰ Menú tipo hamburguesa con acciones */}
              <View style={styles.actions}>
                <Menu>
                  <MenuTrigger>
                    <Icon name="more-vert" size={28} color="#1e90ff" />
                  </MenuTrigger>

                  <MenuOptions optionsContainerStyle={styles.menuOptions}>
                    {/* 🔹 Ver detalle */}
                    <MenuOption onSelect={() => navigation.navigate('DetailPaciente', { paciente: item })}>
                      <Text style={styles.menuOptionText}>Detalle</Text>
                    </MenuOption>

                    {/* ✏️ Editar paciente */}
                    <MenuOption onSelect={() => navigation.navigate('EditPaciente', { paciente: item, updatePaciente })}>
                      <Text style={styles.menuOptionText}>Editar</Text>
                    </MenuOption>

                    {/* 🗑️ Eliminar paciente */}
                    <MenuOption onSelect={() => deletePaciente(item.id)}>
                      <Text style={[styles.menuOptionText, { color: '#ff4d4d' }]}>Eliminar</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* 🔘 Botón flotante para agregar pacientes */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPaciente', { addPaciente })}
      >
        <Icon name="add" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos visuales de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4fb', padding: 15 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#1e90ff', marginLeft: 10 },

  // 🧾 Tarjeta de cada paciente
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#000000ff', flexShrink: 1 },

  // ☰ Contenedor del menú de opciones
  actions: { flexDirection: 'row' },

  // ➕ Botón flotante para agregar pacientes
  addButton: {
    position: 'absolute',
    bottom: 150,
    right: 50,
    backgroundColor: '#1e90ff',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // 🪶 Mensaje cuando la lista está vacía
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 20, fontWeight: '600', color: '#777', marginTop: 10 },
  emptySubText: { fontSize: 15, color: '#999', marginTop: 5 },

  // 📋 Estilo del menú popup
  menuOptions: {
    backgroundColor: '#f0f4f7',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuOptionText: { fontSize: 16, paddingVertical: 6, color: '#333' },
});
