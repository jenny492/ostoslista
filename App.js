import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useState } from 'react';

export default function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('')

  const addItem = () => {
    setItems([...items, item]);
    setItem('');
  };

  return (
    <View style={styles.container}>
      <Text>Shopping list</Text>
      <TextInput
        style={styles.input}
        value={item}
        onChangeText={text => setItem(text)}
      />
      <Button title="Add" onPress={addItem} />

      <FlatList
        data={items}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '50%',
  }
});
