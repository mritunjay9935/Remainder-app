import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, TextInput, Switch, Text } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import PushNotification from "react-native-push-notification";
import Todo from './src/components/Todo';

const App = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [eventId, setEventId] = useState(null);

  const todos = [
    { id: 1, title: 'Buy groceries' },
    { id: 2, title: 'Read a book' },
  ];

  useEffect(() => {
    setupReminders();
    setupDailyAgendaReminder();
  }, []);

  const setupReminders = async () => {
    try {
      const status = await RNCalendarEvents.authorizeEventStore();

      if (status === 'authorized') {
        const id = await RNCalendarEvents.saveEvent('Title of event', {
          startDate: '2022-12-01T19:26:00.000Z',
          endDate: '2022-12-01T20:26:00.000Z',
          allDay,
          alarms: [{
            date: -10 // 10 minutes before
          }]
        });
        setEventId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setupDailyAgendaReminder = async () => {
    const events = await RNCalendarEvents.fetchAllEvents(
      (new Date()).toISOString(),
      (new Date()).toISOString()
    );

    const message = events.length > 0
      ? `You have ${events.length} agendas today.`
      : 'Time to plan';

    PushNotification.localNotificationSchedule({
      message,
      date: new Date().setHours(8, 0, 0, 0), // 8:00 AM
      repeatType: 'day', // Repeat daily
    });
  };

  const addReminder = async () => {
    try {
      const status = await RNCalendarEvents.authorizeEventStore();

      if (status === 'authorized') {
        const id = await RNCalendarEvents.saveEvent(title, {
          startDate,
          endDate,
          allDay,
          alarms: [{
            date: -10 // 10 minutes before
          }]
        });
        setEventId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editReminder = async () => {
    try {
      const status = await RNCalendarEvents.authorizeEventStore();

      if (status === 'authorized' && eventId) {
        await RNCalendarEvents.updateEvent(eventId, {
          title,
          startDate,
          endDate,
          allDay,
          alarms: [{
            date: -10 // 10 minutes before
          }]
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeReminder = async () => {
    try {
      const status = await RNCalendarEvents.authorizeEventStore();

      if (status === 'authorized' && eventId) {
        await RNCalendarEvents.removeEvent(eventId);
        setEventId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Start Date (YYYY-MM-DDTHH:MM:SS.sssZ)"
        value={startDate}
        onChangeText={setStartDate}
        style={styles.textInput}
      />
      <TextInput
        placeholder="End Date (YYYY-MM-DDTHH:MM:SS.sssZ)"
        value={endDate}
        onChangeText={setEndDate}
        style={styles.textInput}
      />
      <View style={styles.switchContainer}>
        <Text>All Day</Text>
        <Switch
          value={allDay}
          onValueChange={setAllDay}
          style={styles.switch}
        />
      </View>
      <Button title="Add Reminder" onPress={addReminder} style={styles.button} />
      <Button title="Edit Reminder" onPress={editReminder} style={styles.button} />
      <Button title="Remove Reminder" onPress={removeReminder} style={styles.button} />
      {todos.map((todo) => (
        <Todo key={todo.id} title={todo.title} />
      ))}
    </View>
  );
};


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    switch: {
      width: 50,
      marginRight: 10,
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'gray',
      marginVertical: 10,
    },
  });

  export default App;