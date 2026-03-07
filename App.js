import * as SQLite from 'expo-sqlite';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabaseSync('shoppinglistdb');

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  const initialize = async () => {
    try {
      await db.execAsync(`
        DROP TABLE IF EXISTS shoppinglist;
        CREATE TABLE IF NOT EXISTS shoppinglist (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
        `);
      await updateList();
      const info = await db.getAllAsync("PRAGMA table_info(shoppinglist)");
      console.log(info);
    } catch (error) {
      console.error('Could not open database', error);
    }
  }
  useEffect(() => { initialize() }, []);

  const saveItem = async () => {
    if (product.length === 0) {
      return;
    }
    try {
      await db.runAsync('INSERT INTO shoppinglist (product, amount) VALUES (?, ?)', product, amount);
      await updateList();
    } catch (error) {
      console.error('Could not save to database', error)
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from shoppinglist');
      setItems(list);
    } catch (error) {
      console.error('Could not update list', error)
    }
  }

  const deleteItem = async (id) => {
    try {
      await db.runAsync('DELETE FROM shoppinglist WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Shopping list</Text>
        <TextInput
          placeholder='Product'
          style={styles.input}
          value={product}
          onChangeText={product => setProduct(product)}
        />
        <TextInput
          placeholder='Amount'
          style={styles.input}
          value={amount}
          onChangeText={amount => setAmount(amount)}
        />
        <Button
          title="Add"
          onPress={saveItem} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Items:</Text>
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View>
              <Text style={styles.listItem}>{item.product}</Text>
              <Text>{item.amount}</Text>
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
  listItem: {
    fontSize: 16,
  },
});
