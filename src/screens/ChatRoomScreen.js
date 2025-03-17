import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { getMessages, postMessage } from "../lib/chat";
import { AuthContext } from "../navigation/AppNavigator";

const { width } = Dimensions.get("window");

const ProfilePlaceholder = ({ name, size = 40 }) => (
  <View
    style={[
      styles.profilePlaceholder,
      { width: size, height: size, borderRadius: size / 2 },
    ]}
  >
    <Text style={[styles.profilePlaceholderText, { fontSize: size / 2 }]}>
      {name?.charAt(0).toUpperCase() || "?"}
    </Text>
  </View>
);

const EmptyMessagesState = ({ onRefresh }) => (
  <View style={styles.emptyStateContainer}>
    <Feather name="message-circle" size={80} color="#CCCCCC" />
    <Text style={styles.emptyStateTitle}>No messages yet</Text>
    <Text style={styles.emptyStateSubtitle}>
      Be the first one to start the conversation!
    </Text>
    <TouchableOpacity style={styles.emptyStateButton} onPress={onRefresh}>
      <Text style={styles.emptyStateButtonText}>Refresh</Text>
    </TouchableOpacity>
  </View>
);

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId, tripName } = route.params;
  const { user } = useContext(AuthContext);
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(40);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const msgs = await getMessages(tripId);
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load messages",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    navigation.setOptions({ title: tripName });
  }, [tripId]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    try {
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        content: inputMessage.trim(),
        sender: user,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, tempMessage]);
      setInputMessage("");
      setInputHeight(40);
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
      const newMsg = await postMessage(tripId, tempMessage.content);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessage._id ? newMsg : msg))
      );
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send message",
        text2: "Please try again",
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = String(item.sender._id) === String(user._id);
    return (
      <View
        style={[
          styles.messageWrapper,
          isMyMessage ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {/* For other users, show avatar on left */}
        {!isMyMessage ? (
          item.sender.photo && item.sender.photo.trim() !== "" ? (
            <Image source={{ uri: item.sender.photo }} style={styles.avatar} />
          ) : (
            <ProfilePlaceholder name={item.sender.name} size={40} />
          )
        ) : null}
        <View
          style={[
            styles.messageContent,
            isMyMessage ? styles.myMessageContent : styles.otherMessageContent,
          ]}
        >
          {!isMyMessage && (
            <Text style={styles.senderName}>{item.sender.name}</Text>
          )}
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myBubble : styles.otherBubble,
              item.pending && styles.pendingMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {item.content}
            </Text>
          </View>
          <View
            style={[
              styles.timestampContainer,
              isMyMessage
                ? styles.myTimestampContainer
                : styles.otherTimestampContainer,
            ]}
          >
            {item.pending && (
              <Feather
                name="clock"
                size={12}
                color="#999"
                style={styles.pendingIcon}
              />
            )}
            <Text style={styles.timestamp}>
              {formatTimestamp(item.createdAt)}
            </Text>
          </View>
        </View>
        {/* For my messages, show avatar on right */}
        {isMyMessage ? (
          user.photo && user.photo.trim() !== "" ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <ProfilePlaceholder name={user.name} size={40} />
          )
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#4CAF50" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4CAF50"]}
            />
          }
          ListEmptyComponent={<EmptyMessagesState onRefresh={onRefresh} />}
          onContentSizeChange={() => {
            if (messages.length > 0 && flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
        />
      )}

      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TextInput
          style={[styles.input, { height: Math.min(100, inputHeight) }]}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          onContentSizeChange={(e) => {
            setInputHeight(e.nativeEvent.contentSize.height + 16);
          }}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputMessage.trim() === "" && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={inputMessage.trim() === ""}
        >
          <Feather
            name="send"
            size={24}
            color={inputMessage.trim() === "" ? "#CCC" : "#4CAF50"}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F2F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  infoButton: { padding: 8 },
  messagesList: { padding: 16, paddingBottom: 32 },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  loader: { marginTop: 32 },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  messageContent: {
    flex: 1,
    maxWidth: "75%",
  },
  myMessageContent: {
    alignItems: "flex-end",
  },
  otherMessageContent: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "100%",
  },
  myBubble: {
    backgroundColor: "#E7F7E8",
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: "#D4EBD6",
  },
  otherBubble: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  pendingMessage: { opacity: 0.7 },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  myMessageText: {
    textAlign: "left",
  },
  otherMessageText: {
    textAlign: "left",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal:4,
  },
  myTimestampContainer: {
    justifyContent: "flex-end",
  },
  otherTimestampContainer: {
    justifyContent: "flex-start",
  },
  pendingIcon: { marginRight: 4 },
  timestamp: {
    fontSize: 11,
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#F0F2F5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
  },
  sendButtonDisabled: { opacity: 0.6 },
  profilePlaceholder: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholderText: { color: "#FFF", fontWeight: "bold" },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});

export default ChatRoomScreen;
