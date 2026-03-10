import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

export default function App() {

  const database = getDatabase(app);

  const [items, setItems] = useState([]);
  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });

  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, 'items/'), product);
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  };

  const deleteItem = (id) => {
    remove(ref(database, `items/${id}`));
  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setItems(items);
      } else {
        setItems([]);
      }
    })
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Shopping list</Text>
        <TextInput
          placeholder='Product'
          style={styles.input}
          value={product.title}
          onChangeText={text => setProduct({ ...product, title: text })}
        />
        <TextInput
          placeholder='Amount'
          style={styles.input}
          value={product.amount}
          onChangeText={text => setProduct({ ...product, amount: text })}
        />
        <Button
          title="Add"
          onPress={handleSave} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Items:</Text>
        <FlatList
          data={items}
          renderItem={({ item }) =>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.listItem}>{item.title}, {item.amount}</Text>
              <Text style={styles.listDelete} onPress={() => deleteItem(item.id)}>Delete</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingTop: 70,
    paddingHorizontal: 40,
  },
  bodyContainer: {
    marginBottom: 20,
    marginTop: 20,
    gap: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginTop: 20,
  },
  listItem: {
    fontSize: 16,
  },
  listDelete: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
  },
});
