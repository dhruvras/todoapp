import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';



type ToDoList = {
  key: string;
  task: string;
  completed: boolean;
};

const STORAGE_KEY = 'taskdata';


// Save list to AsyncStorage
const storeData = async (value: ToDoList[]) => {
  try {
    console.log('Storing data:', value);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

// Load list from AsyncStorage
const getData = async (): Promise<ToDoList[] | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.error('Error loading data:', e);
    return null;
  }
};

export default function Index() {
  const date = new Date();
  const [toDo, setToDo] = useState<ToDoList[]>([]);

  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  const toggleCompleted = (key: string) => {
    setToDo(prev =>
        prev.map(item =>
          item.key === key
            ? { ...item, completed: !item.completed } // toggle completed
            : item
        )
      );
    };


  // ✅ Load saved data (or default data if none)
  useEffect(() => {
    const loadData = async () => {
      const saved = await getData();
      if (saved && saved.length > 0) {
        setToDo(saved);
      } else {
        setToDo([]);
        await storeData([]);
      }
    };
    loadData();
  }, []);

  // ✅ Add a task (functional update + unique key + proper saving)
  const addTask = (newTask: string) => {
    setToDo(prev => {
      const newItem: ToDoList = {
        key: Date.now().toString(),
        task: newTask,
        completed: true,
      };
      const updated = [...prev, newItem];
      storeData(updated);
      return updated;
    });
  };

  // ✅ Remove a task (functional update + proper saving)
  const removeTask = (key: string) => {
    setToDo(prev => {
      const updated = prev.filter(item => item.key !== key);
      storeData(updated);
      return updated;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dhruv;)</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Task heading */}
      <Text style={styles.task}>Your Tasks:</Text>

      {/* FlatList */}
      <FlatList
        style={styles.mainframe}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
        }}
        data={toDo}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.itemcard,item.completed && { textDecorationLine: 'line-through', opacity: 0.5 }] } onPress={() => toggleCompleted(item.key)}>
            <Text style={[item.completed && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{item.task}</Text>
            <TouchableOpacity onPress={() => removeTask(item.key)} >
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.button} onPress={() => addTask('New Task')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    width: '100%',
    marginTop: 30,
    marginLeft: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  task: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
  },
  date: {
    fontSize: 25,
    paddingTop: 5,
    paddingLeft: 7,
  },
  mainframe: {
    flex: 1,
    width: '95%',
    borderRadius: 20,
    paddingTop: 10,
    backgroundColor: '#ddddddff',
    alignSelf: 'center',
    marginTop: 10,
  },
  itemcard: {
    height: 70,
    width: 350,
    backgroundColor: 'white',
    marginVertical: 5,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  button: {
    position: 'absolute',
    bottom: 45,
    right: 25,
    backgroundColor: '#007AFF',
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
  },
});
