// src/screens/EditProductScreen.jsx
import React from 'react';
import { View, Button, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// Importamos las funciones de Firestore para actualizar y referenciar un documento
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Ajusta la ruta si es necesario

// El componente recibe 'route' para acceder a los parámetros y 'navigation'
const EditProductScreen = ({ route, navigation }) => {
  // 1. Obtenemos el producto que pasamos desde la lista
  const { product } = route.params;

  // 2. Inicializamos el formulario con los valores del producto a editar
  // ¡Importante! Los valores de los inputs deben ser strings.
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    }
  });

  const onSubmit = async (data) => {
    try {
      // Referencia al documento específico que queremos actualizar
      const productDocRef = doc(db, 'products', product.id);

      // Preparamos los datos para la actualización, convirtiendo a números
      const updatedData = {
        name: data.name,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
      };

      // 3. Usamos 'updateDoc' para guardar los cambios
      await updateDoc(productDocRef, updatedData);

      Alert.alert("Éxito", "Producto actualizado correctamente.");
      navigation.goBack(); // Volvemos a la pantalla de lista
    } catch (error) {
      console.error("Error actualizando producto: ", error);
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Producto</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'El nombre es obligatorio.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre del Producto"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      
      <Text style={styles.label}>Precio</Text>
      <Controller
        control={control}
        name="price"
        rules={{ required: 'El precio es obligatorio.', pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ingresa un precio válido.' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Precio (ej: 25.99)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

      <Text style={styles.label}>Stock</Text>
      <Controller
        control={control}
        name="stock"
        rules={{ required: 'El stock es obligatorio.', pattern: { value: /^[0-9]+$/, message: 'Ingresa un número entero.' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Cantidad en Stock"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad"
          />
        )}
      />
      {errors.stock && <Text style={styles.errorText}>{errors.stock.message}</Text>}

      <Button title="Guardar Cambios" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 5,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
    },
});

export default EditProductScreen;