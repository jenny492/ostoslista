import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, Divider, IconButton, PaperProvider, Text, TextInput } from 'react-native-paper';

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
      <View style={styles.container}>

        <TextInput
          style={styles.textInput}
          label="Product"
          value={product}
          onChangeText={product => setProduct(product)}
        />
        <TextInput
          style={styles.textInput}
          label="Amount"
          value={amount}
          onChangeText={amount => setAmount(amount)}
        />
        <Button
          mode="contained"
          icon="content-save"
          onPress={saveItem}>
          Save
        </Button>

        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View style={{ width: '100%' }}>
              <View style={styles.listItem}>
                <View>
                  <Text variant="titleMedium">{item.product}</Text>
                  <Text variant="bodySmall">{item.amount}</Text>
                </View>
                <IconButton
                  icon="delete"
                  iconColor="red"
                  onPress={() => deleteItem(item.id)}
                />
              </View>
              <Divider />
            </View>
          }
        />

      </View>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '90%',
    marginBottom: 10,
  },
  list: {
    marginTop: 10,
    width: '90%'
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}); 
