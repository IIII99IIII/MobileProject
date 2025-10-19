// src/screens/ProductListScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';

// 1. Importamos las funciones de Firestore y nuestra 'db'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Ajusta la ruta si es necesario

// El componente recibe 'navigation' para poder ir a otras pantallas
const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  // 2. useEffect para obtener los datos en tiempo real
  useEffect(() => {
    // Referencia a la colección 'products' en Firestore
    const productsCollection = collection(db, 'products');

    // onSnapshot es el listener en tiempo real
    const unsubscribe = onSnapshot(productsCollection, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        // Creamos un objeto por cada producto con su id y data
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
    });

    // Se limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleDelete = (productId) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: async () => {
            try {
              await deleteDoc(doc(db, 'products', productId));
              Alert.alert("Éxito", "Producto eliminado correctamente.");
            } catch (error) {
              console.error("Error eliminando producto: ", error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // 3. Renderizamos la lista con FlatList
  return (
    <View style={styles.container}>
      <Button
        title="Agregar Nuevo Producto"
        onPress={() => navigation.navigate('AddProduct')}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>Precio: ${item.price}</Text>
              <Text>Stock: {item.stock}</Text>
            </View>
            <View style={styles.itemActions}>
              <Button title="Editar" onPress={() => navigation.navigate('EditProduct', { product: item })} />
              <Button title="Borrar" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
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
    itemInfo: {
        flex: 2,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemActions: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 8,
    },
});

export default ProductListScreen;