import { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TextEncoder, TextDecoder } from 'text-encoding';

Object.assign(global, { TextEncoder, TextDecoder });

export default function HomeScreen() {
  const [message, setMessage] = useState('No message yet...');
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://192.168.0.121:8080/ws'),
      onConnect: () => {
        setConnected(true);
        client.subscribe('/queue/messages', (msg) => {
          setMessage(msg.body);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('STOMP error', frame),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, []);

  const sendTrigger = () => {
    if (!clientRef.current?.connected) {
      console.warn('WebSocket not connected');
      return;
    }
    clientRef.current.publish({ destination: '/app/trigger' });
  };

  const clearMessage = () => {
    setMessage('No message yet...');
  };

  return (
      <View style={styles.container}>
        <Text style={styles.status}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        <Button title="Send Trigger" onPress={sendTrigger} disabled={!connected} />
        <Button title="Clear Message" onPress={clearMessage} />
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  status: { fontSize: 16, fontWeight: 'bold' },
  messageBox: {
    marginTop: 20, padding: 20, borderWidth: 1,
    borderColor: '#ccc', borderRadius: 8, minWidth: 280, alignItems: 'center'
  },
  messageText: { fontSize: 16, color: '#333' },
});