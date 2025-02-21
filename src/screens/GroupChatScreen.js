// src/screens/GroupChatScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const dummyMessages = [
  { id: '1', text: 'Hello everyone!', sender: 'self' },
  { id: '2', text: "Hi! What's the plan for today?", sender: 'other' },
  { id: '3', text: "Let's meet at 10 AM.", sender: 'self' },
];

const GroupChatScreen = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'self' }]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'self' ? styles.selfMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Group Chat</Text>
      </View>
      <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item.id} style={styles.chatArea} />
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 15, backgroundColor: '#007AFF' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatArea: { flex: 1, padding: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  selfMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#eee', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputArea: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendButton: { justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#007AFF', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default GroupChatScreen;
