import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'


export default function NotificationView({ navigation }) {

  const routes = useRoute();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routes.params.notificationTitle}</Text>
      <Text style={styles.body}>{routes.params.notificationBody}</Text>
      <View style={{ margin: 10 }}>
        <Button title="Eu quero" onPress={() => navigation.goBack()} />
      </View>
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
  title: {
    fontSize: 22,
    color: 'white'
  },
  body: {
    fontSize: 16,
    color: 'white'
  },
})