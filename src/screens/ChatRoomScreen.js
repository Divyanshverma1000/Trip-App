import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mock chat messages
const mockMessages = [
  {
    id: '1',
    sender: { id: '1', name: 'John', photo: 'https://example.com/john.jpg' },
    message: 'Hey everyone! Just a reminder about our departure time tomorrow.',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: { id: '2', name: 'Sarah', photo: 'https://example.com/sarah.jpg' },
    message: 'What time are we meeting at the campus?',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    sender: { id: '1', name: 'John', photo: 'https://example.com/john.jpg' },
    message: "8 PM sharp! Don't forget to bring your ID cards and warm clothes.",
    timestamp: '10:32 AM',
  },
  {
    id: '4',
    sender: { id: '3', name: 'Mike', photo: 'https://example.com/mike.jpg' },
    message: 'Got it! Should we bring some snacks for the journey?',
    timestamp: '10:35 AM',
  },
  {
    id: '5',
    sender: { id: '2', name: 'Sarah', photo: 'https://example.com/sarah.jpg' },
    message: "Yes, let's bring some snacks and water bottles.",
    timestamp: '10:36 AM',
  },
  {
    id: '6',
    sender: { id: '1', name: 'John', photo: 'https://example.com/john.jpg' },
    message: 'Also, make sure to pack your raincoats. Weather forecast shows light rain.',
    timestamp: '10:38 AM',
  }
];

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripName } = route.params;
  const [message, setMessage] = useState('');

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Image
        source={{ uri: item.sender.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.sender.name)}` }}
        style={styles.senderAvatar}
      />
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>{item.sender.name}</Text>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tripName}</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Feather name="info" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => {
            // Handle sending message
            setMessage('');
          }}
        >
          <Feather name="send" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  infoButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatRoomScreen; 