import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('')

  const addItem = () => {
    setItems([...items, item]);
    setItem('');
  };

  const clearItems = () => {
    setItems([]);
  }

  return (
    <View style={styles.container}>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Shopping list</Text>
        <Text style={styles.text}>Add an item:</Text>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={text => setItem(text)}
        />
        <Button
          title="Add"
          onPress={addItem} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.header}>Items:</Text>
        <FlatList
          data={items}
          renderItem={({ item }) =>
              <Text style={styles.listItem}>{item}</Text>
          }
        />
        <Button
          title="Clear list"
          onPress={clearItems} />
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
});
