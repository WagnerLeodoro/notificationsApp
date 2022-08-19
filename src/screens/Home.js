import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationIcon from '@expo/vector-icons/Ionicons';
import Icon from '@expo/vector-icons/MaterialIcons';

import { messages } from '../utils/mock'
import { isDevice } from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({
    title: '',
    body: ''
  });

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      setNotificationContent({ title: notification.request.content.title, body: notification.request.content.body })
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate("Notification", {
        notificationTitle: notification && response.notification.request.content.title,
        notificationBody: notification && response.notification.request.content.body
      })
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, [notificationContent]);

  async function registerForPushNotificationsAsync() {
    let token;
    if (isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  async function schedulePushNotification() {
    let rand = Math.floor(Math.random() * messages.length)
    console.log(rand)
    const randMsg = messages[rand];
    await Notifications.scheduleNotificationAsync(
      (
        {
          content: {
            title: randMsg.title,
            body: randMsg.body,
            sound: true,
          },
          trigger: { seconds: 20 }
        }
      ))
  }



  return (
    <View style={styles.container}>
      <Icon name="dinner-dining" size={140} color='white' />
      <NotificationIcon.Button
        name='notifications-outline'
        size={30}
        onPress={schedulePushNotification}>
        <Text style={styles.textButton}>
          Enviar Notificação
        </Text>
      </NotificationIcon.Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202024'
  },
  textButton: {
    fontSize: 18,
    color: 'white'
  }
})