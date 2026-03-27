import * as SQLite from 'expo-sqlite';
import { FlatList, View } from 'react-native';
import { useEffect, useState } from 'react';
import { PaperProvider, Button, Appbar, TextInput, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const db = SQLite.openDatabaseSync('shoppinglistdb');

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS shoppinglist (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
        `);
      await updateList();
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
      setProduct('');
      setAmount('');
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
      await db.runAsync('DELETE FROM shoppinglist WHERE id=?', id); // tässä on oltava async, koska muuten ei odoteta, että tietokanta on valmis ennen kuin päivitetään lista
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  return (
    <PaperProvider>
      <Appbar.Header elevated>
        <Appbar.Content title="Shopping list" />
      </Appbar.Header>
      <View>
        <TextInput
          placeholder='Product'
          value={product}
          onChangeText={product => setProduct(product)}
        />
        <TextInput
          placeholder='Amount'
          value={amount}
          onChangeText={amount => setAmount(amount)}
        />
        <Button
          title="Add"
          mode="contained" 
          icon="search-web"
          onPress={saveItem} />
      </View>

      <View>
        <Text>Items:</Text>
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View style={{ flexDirection: 'row' }}>
              <Text>{item.product}, {item.amount}</Text>
              <Text onPress={() => deleteItem(item.id)}>Bought</Text>
            </View>
          }
        />
      </View>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

/* const styles = StyleSheet.create({
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
  listDelete: {
    flex: 1,
    textAlign: 'right'
  },
}); */
