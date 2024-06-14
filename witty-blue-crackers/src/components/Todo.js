import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Todo = ({ title }) => {
  return (
    <View style={styles.todoItem}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default Todo;