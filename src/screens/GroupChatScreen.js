// src/screens/GroupChatScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Mock data for trip groups
const mockTripGroups = [
  {
    id: '1',
    tripName: 'Bali Adventure 2024',
    lastMessage: "We'll be meeting at the airport at 6 AM sharp!",
    timestamp: '2 min ago',
    unreadCount: 3,
    coverPhoto: 'https://example.com/bali.jpg',
    members: [
      { id: '1', name: 'John', photo: 'https://example.com/john.jpg' },
      { id: '2', name: 'Sarah', photo: 'https://example.com/sarah.jpg' },
      { id: '3', name: 'Mike', photo: 'https://example.com/mike.jpg' }
    ]
  },
  {
    id: '2',
    tripName: 'Manali Trek Group',
    lastMessage: "Don't forget to pack warm clothes and hiking boots",
    timestamp: '1 hour ago',
    unreadCount: 1,
    coverPhoto: 'https://example.com/manali.jpg',
    members: [
      { id: '3', name: 'Mike', photo: 'https://example.com/mike.jpg' },
      { id: '4', name: 'Emma', photo: 'https://example.com/emma.jpg' },
      { id: '5', name: 'Alex', photo: 'https://example.com/alex.jpg' }
    ]
  },
  {
    id: '3',
    tripName: 'Goa Beach Trip',
    lastMessage: "I've shared the hotel booking details in the group",
    timestamp: '3 hours ago',
    unreadCount: 0,
    coverPhoto: 'https://example.com/goa.jpg',
    members: [
      { id: '6', name: 'Lisa', photo: 'https://example.com/lisa.jpg' },
      { id: '7', name: 'Tom', photo: 'https://example.com/tom.jpg' },
      { id: '8', name: 'Anna', photo: 'https://example.com/anna.jpg' }
    ]
  }
];

const GroupChatScreen = () => {
  const navigation = useNavigation();

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate('ChatRoom', { groupId: item.id, tripName: item.tripName })}
    >
      <Image
        source={{ 
          uri: item.coverPhoto || 'https://via.placeholder.com/60x60'
        }}
        style={styles.groupImage}
      />
      <View style={styles.groupInfo}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.tripName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <View style={styles.memberAvatars}>
          {item.members.slice(0, 3).map((member, index) => (
            <Image
              key={member.id}
              source={{ uri: member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}` }}
              style={[
                styles.memberAvatar,
                { marginLeft: index > 0 ? -10 : 0 }
              ]}
            />
          ))}
          {item.members.length > 3 && (
            <View style={styles.moreMembers}>
              <Text style={styles.moreMembersText}>+{item.members.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Chats</Text>
      </View>
      <FlatList
        data={mockTripGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  groupCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreMembers: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreMembersText: {
    fontSize: 10,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GroupChatScreen;
