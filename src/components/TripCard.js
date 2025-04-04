// TripCard.jsx
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { AuthContext } from "../navigation/AppNavigator";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 3 - 12; // 3 cards per row with 8px gap
const CARD_HEIGHT = CARD_WIDTH * 1.2; // Maintain aspect ratio

const TripCard = ({
  trip,
  style,
  onPress,
  showDeleteOption = false,
  onDelete,
}) => {
  const { user } = useContext(AuthContext);
  const isHost = user?.id === trip?.host?._id;

  // Use coverPhoto if available, otherwise use first photo from the photos array
  const photoUrl =
    trip.coverPhoto ||
    (trip.photos && trip.photos.length > 0
      ? trip.photos[0].url
      : "https://via.placeholder.com/200x120");

  const acceptedMembersCount =
    trip.members?.filter((member) => member.status === "accepted").length || 0;

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image source={{ uri: photoUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Ionicons name="people-outline" size={12} color="#FFF" />
              <Text style={styles.detailText}>{acceptedMembersCount}</Text>
            </View>
            <View style={styles.detail}>
              <Ionicons name="calendar-outline" size={16} color="#FFF" />
              <Text style={styles.detailText}>
                {trip.status === "planning" ? "Planning" : "Ongoing"}
              </Text>
            </View>
          </View>
        </View>

        {showDeleteOption && isHost && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete?.(trip);
            }}
          >
            <Feather name="trash-2" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  textContainer: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  detailText: {
    color: "#FFF",
    marginLeft: 2,
    fontSize: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 82, 82, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
});

export default TripCard;
