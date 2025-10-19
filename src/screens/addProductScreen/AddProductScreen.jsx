// src/screens/AddProductScreen.jsx
import React from 'react';
import { View, Button, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// Importamos la función para añadir documentos y nuestra 'db'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Asegúrate que la ruta sea la correcta

const AddProductScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', price: '', stock: '' }
  });

  const onSubmit = async (data) => {
    try {
      // Convertimos los valores a números donde sea necesario
      const productData = {
        name: data.name,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
      };
      // addDoc añade un nuevo documento con un ID generado automáticamente
      await addDoc(collection(db, 'products'), productData);
      Alert.alert("Éxito", "Producto añadido correctamente.");
      navigation.goBack(); // Volvemos a la lista
    } catch (error) {
      console.error("Error añadiendo producto: ", error);
      Alert.alert("Error", "No se pudo añadir el producto.");
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
            placeholder="Ej: Camiseta React Native"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      {/* --- INPUT DE PRECIO AÑADIDO --- */}
      <Text style={styles.label}>Precio</Text>
      <Controller
        control={control}
        name="price"
        rules={{ 
          required: 'El precio es obligatorio.',
          pattern: {
            value: /^[0-9]+(\.[0-9]{1,2})?$/,
            message: 'Ingresa un precio válido (ej: 25.99).'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ej: 29.99"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric" // Muestra teclado numérico
          />
        )}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

      {/* --- INPUT DE STOCK AÑADIDO --- */}
      <Text style={styles.label}>Stock Disponible</Text>
      <Controller
        control={control}
        name="stock"
        rules={{
          required: 'El stock es obligatorio.',
          pattern: {
            value: /^[0-9]+$/,
            message: 'Ingresa un número entero válido.'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ej: 100"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad" // Muestra teclado numérico simple
          />
        )}
      />
      {errors.stock && <Text style={styles.errorText}>{errors.stock.message}</Text>}

      <Button title="Guardar Producto" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

export default AddProductScreen;