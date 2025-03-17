import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  StatusBar,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { useSharedValue, FadeInUp } from "react-native-reanimated";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getTrip, joinTrip as joinTripApi, deleteTrip, leaveTrip } from "../lib/trips";
import { TripHeader } from "../components/TripHeader";
import { TripTag } from "../components/TripTag";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { getStorageItem } from "../lib/storage";
import { AuthContext } from "../navigation/AppNavigator";
import DeleteTripModal from "../components/DeleteTripModal";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TripDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tripId = route?.params?.tripId;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const [userId, setUserId] = useState(null);
  const [joining, setJoining] = useState(false);
  const scrollY = useSharedValue(0);
  const { user } = useContext(AuthContext);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if current user is host or has editor role
  const hasEditAccess = React.useMemo(() => {
    if (!trip || !user) return false;

    // Check if user is host
    if (trip.host._id === user.id) return true;

    // Check if user is a member with editor role
    const userMember = trip.members.find(member => 
      member.user._id === user.id && 
      member.status === 'accepted'
    );
    
    return userMember?.role === 'editor';
  }, [trip, user]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUserId = await getStorageItem("userId");
        setUserId(currentUserId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (tripId) {
      setLoading(true);
      getTrip(tripId)
        .then((data) => {
          setTrip(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch trip:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [tripId]);

  const isMember = trip?.members?.some(
    (member) => member.user.toString() === userId && member.status === "accepted"
  );

  const isHost = user?.id === trip?.host?._id;

  const joinTrip = async (tripId) => {
    if (joining) return;
    try {
      setJoining(true);
      await joinTripApi(tripId);
      const updatedTrip = await getTrip(tripId);
      setTrip(updatedTrip);
    } catch (error) {
      Alert.alert(
        "Join Failed",
        error.message || "Unable to join the trip. Please try again later."
      );
    } finally {
      setJoining(false);
    }
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const handleDeleteTrip = async () => {
    try {
      setDeleteLoading(true);
      await deleteTrip(trip._id);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!tripId || loading || !trip) {
    return (
      <View style={styles.centered}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <Text style={styles.errorText}>
            {!tripId ? "Error: No trip selected." : "Trip not found"}
          </Text>
        )}
      </View>
    );
  }

  const handleLeaveTrip = async () => {
    Alert.alert(
      'Leave Trip',
      'Are you sure you want to leave this trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveTrip(trip._id);
              navigation.navigate('Home');
            } catch (error) {
              console.error('Failed to leave trip:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const isAcceptedMember = trip?.members?.some(
    member => member.user._id === user?.id && 
    member.status === 'accepted' && 
    member.role !== 'host'
  );

  const renderHeaderRight = () => {
    if (!isHost) return null;
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShowDeleteModal(true)}
      >
        <Feather name="trash-2" size={24} color="#FF5252" />
      </TouchableOpacity>
    );
  };

  const renderTripCard = ({ item }) => (
    <TripCard
      trip={item}
      style={styles.tripCard}
      onPress={() =>
        navigation.navigate("TripDetailsScreen", { tripId: item._id })
      }
      showDeleteOption={true}
      onDelete={setTripToDelete}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TripHeader coverPhoto={trip.coverPhoto} title={trip.title} scrollY={scrollY} />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.contentPadding} />
        <View style={styles.content}>
          <Text style={styles.description}>{trip.description}</Text>

          {/* Trip Photos Gallery */}
          {trip.tripPhotos?.length > 0 && (
            <View style={styles.photoGalleryCard}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name="photo-library" size={24} color="#6366F1" />
                {' Trip Photos'}
              </Text>
              <FlatList
                data={trip.tripPhotos}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    // onPress={() => navigation.navigate('PhotoView', { photos: trip.tripPhotos })}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={styles.galleryPhoto}
                      loading="lazy"
                    />
                    {item.caption && (
                      <Text style={styles.photoCaption}>{item.caption}</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Add Edit Itinerary Button only for users with access */}
          {hasEditAccess && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('ItineraryPlanning', { tripId: trip._id })}
            >
              <View style={styles.editButtonContent}>
                <Feather 
                  name={trip.itinerary?.length > 0 ? "edit-2" : "plus"} 
                  size={20} 
                  color="#FFF" 
                />
                <Text style={styles.editButtonText}>
                  {trip.itinerary?.length > 0 ? 'Edit Itinerary' : 'Add Itinerary'}
                </Text>
              </View>
              <View style={styles.editButtonStatus}>
                <Text style={styles.statusText}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Show a message for viewers */}
          {trip.members.some(member => 
            member.user._id === user?.id && 
            member.status === 'accepted' && 
            member.role === 'viewer'
          ) && (
            <View style={styles.viewerMessage}>
              <Feather name="info" size={16} color="#666" />
              <Text style={styles.viewerMessageText}>
                You have viewer access to this trip
              </Text>
            </View>
          )}

          {/* Invite Friends Button for Host */}
          {isHost && (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() =>
                navigation.navigate("InviteFriends", { tripData: trip })
              }
            >
              <Feather name="user-plus" size={24} color="#FFF" />
              <Text style={styles.inviteButtonText}>Invite Friends</Text>
            </TouchableOpacity>
          )}

          <View style={styles.highlightCard}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={24} color="#6366F1" />
                <Text style={styles.detailLabel}>Destination</Text>
                <Text style={styles.detailValue}>
                  {trip.metadata.destination}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="calendar-range" size={24} color="#6366F1" />
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
                  {trip.metadata.duration} days
                </Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome5 name="money-bill-wave" size={20} color="#6366F1" />
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>${trip.estimatedBudget}</Text>
              </View>
            </View>
          </View>

          {trip.isPublic && (
            <>
              {!isMember ? (
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    joining && styles.joinButtonDisabled,
                  ]}
                  onPress={() => joinTrip(trip._id)}
                  disabled={joining}
                >
                  {joining ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <MaterialIcons name="group-add" size={24} color="#FFF" />
                      <Text style={styles.joinButtonText}>Join This Trip</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.joinedButton}
                  onPress={() =>
                    Alert.alert(
                      "Already Joined",
                      "You have already joined this trip."
                    )
                  }
                >
                  <MaterialIcons name="check-circle" size={24} color="#FFF" />
                  <Text style={styles.joinedButtonText}>Already Joined</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {trip.itinerary?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialCommunityIcons name="map-marker-path" size={24} color="#6366F1" />
                {" Trip Itinerary"}
              </Text>
              {trip.itinerary.map((dayItem, index) => (
                <Animated.View
                  key={index}
                  entering={
                    Platform.OS !== "web"
                      ? FadeInUp.delay(index * 200)
                      : undefined
                  }
                >
                  <TouchableOpacity
                    style={styles.dayHeader}
                    onPress={() => toggleDayExpansion(index)}
                  >
                    <View style={styles.dayHeaderLeft}>
                      <Text style={styles.dayNumber}>
                        Day {dayItem.day || index + 1}
                      </Text>
                      <Text style={styles.dayPlaces} numberOfLines={1}>
                        {dayItem.places?.map((place) => place.name).join(", ") ||
                          "Places covered"}
                      </Text>
                    </View>
                    <MaterialIcons
                      name={
                        expandedDay === index ? "expand-less" : "expand-more"
                      }
                      size={24}
                      color="#6366F1"
                    />
                  </TouchableOpacity>

                  {expandedDay === index && (
                    <View style={styles.dayContent}>
                      <Text style={styles.dayNotes}>{dayItem.dayNotes}</Text>

                      {dayItem.stay && (
                        <View style={styles.stayCard}>
                          <View style={styles.stayHeader}>
                            <MaterialIcons name="hotel" size={24} color="#6366F1" />
                            <Text style={styles.stayTitle}>
                              {dayItem.stay.hotelName}
                            </Text>
                          </View>
                          <Text style={styles.stayAddress}>
                            {dayItem.stay.address}
                          </Text>
                          <Text style={styles.stayDescription}>
                            {dayItem.stay.description}
                          </Text>
                          <View style={styles.stayDetails}>
                            <Text style={styles.stayCost}>
                              ${dayItem.stay.cost}/night
                            </Text>
                            <View style={styles.ratingContainer}>
                              <MaterialIcons
                                name="star"
                                size={18}
                                color="#FFD700"
                              />
                              <Text style={styles.stayRating}>
                                {dayItem.stay.rating}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {dayItem.places?.length > 0 && (
                        <View style={styles.placesSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialIcons name="place" size={20} color="#6366F1" />
                            {" Places to Visit"}
                          </Text>
                          {dayItem.places.map((place, idx) => (
                            <View key={idx} style={styles.placeItem}>
                              <Text style={styles.placeName}>{place.name}</Text>
                              <Text style={styles.placeDescription}>
                                {place.description}
                              </Text>
                              <Text style={styles.placeAddress}>
                                {place.address}
                              </Text>
                              {place.visitDuration && (
                                <Text style={styles.visitDuration}>
                                  Duration: {place.visitDuration}
                                </Text>
                              )}
                              {place.entranceFee && (
                                <Text style={styles.placeCost}>
                                  Entrance Fee: ${place.entranceFee}
                                </Text>
                              )}
                            </View>
                          ))}
                        </View>
                      )}

                      {dayItem.activities?.length > 0 && (
                        <View style={styles.activitiesSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialCommunityIcons
                              name="hiking"
                              size={20}
                              color="#6366F1"
                            />
                            {" Activities"}
                          </Text>
                          {dayItem.activities.map((activity, idx) => (
                            <View key={idx} style={styles.activityItem}>
                              <Text style={styles.activityName}>
                                {activity.activityName}
                              </Text>
                              <Text style={styles.activityDescription}>
                                {activity.description}
                              </Text>
                              <Text style={styles.activityCost}>
                                ${activity.cost}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {dayItem.restaurant?.length > 0 && (
                        <View style={styles.restaurantsSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialCommunityIcons
                              name="food"
                              size={20}
                              color="#6366F1"
                            />
                            {" Restaurants"}
                          </Text>
                          {dayItem.restaurant.map((rest, idx) => (
                            <View key={idx} style={styles.restaurantItem}>
                              <Text style={styles.restaurantName}>{rest.name}</Text>
                              <Text style={styles.mealType}>{rest.mealType}</Text>
                              <Text style={styles.restaurantAddress}>
                                {rest.address}
                              </Text>
                              <Text style={styles.restaurantDescription}>
                                {rest.description}
                              </Text>
                              <Text style={styles.restaurantCost}>
                                ${rest.cost}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </Animated.View>
              ))}
            </View>
          )}

          {trip.packingEssentials?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialCommunityIcons
                  name="bag-personal"
                  size={24}
                  color="#6366F1"
                />
                {" Packing Essentials"}
              </Text>
              <View style={styles.essentialsList}>
                {trip.packingEssentials.map((item, index) => (
                  <Text key={index} style={styles.essentialItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {trip.tags?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialCommunityIcons
                  name="tag-multiple"
                  size={24}
                  color="#6366F1"
                />
                {" Trip Tags"}
              </Text>
              <View style={styles.tagsContainer}>
                {trip.tags.map((tag, index) => (
                  <TripTag key={index} tag={tag} index={index} />
                ))}
              </View>
            </View>
          )}

          {trip.host && (
            <View style={styles.hostCard}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name="person" size={24} color="#6366F1" />
                {" Trip Host"}
              </Text>
              <View style={styles.hostContainer}>
                {trip.host.photo && trip.host.photo.trim() !== "" ? (
                  <Image
                    source={{ uri: trip.host.photo }}
                    style={styles.hostImage}
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profilePlaceholderText}>
                      {trip.host.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{trip.host.name}</Text>
                  <Text style={styles.hostEmail}>{trip.host.email}</Text>
                  <TouchableOpacity style={styles.contactButton}>
                    <MaterialIcons name="mail" size={20} color="#FFF" />
                    <Text style={styles.contactButtonText}> Contact Host</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {trip.members?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name="people" size={24} color="#6366F1" />
                {" Trip Members"}
              </Text>
              <View style={styles.membersContainer}>
                {trip.members.map((member) => (
                  <View
                    key={member.user._id}
                    style={[
                      styles.memberItem,
                      member.user._id === trip.host._id && styles.hostMemberItem,
                    ]}
                  >
                    <Image
                      source={{ uri: member.user.photo }}
                      style={styles.memberPhoto}
                    />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>
                        {member.user.name}
                        {member.user._id === trip.host._id && (
                          <Text style={styles.hostBadge}> (Host)</Text>
                        )}
                      </Text>
                      <Text
                        style={[
                          styles.memberStatus,
                          member.status === "accepted" && styles.acceptedStatus,
                          member.status === "pending" && styles.pendingStatus,
                        ]}
                      >
                        {member.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Chat Room Button */}
          <TouchableOpacity
            style={styles.chatRoomButton}
            onPress={() =>
              navigation.navigate("ChatRoomScreen", {
                tripId: trip._id,
                tripName: trip.title,
              })
            }
          >
            <MaterialIcons name="chat" size={24} color="#fff" />
            <Text style={styles.chatRoomButtonText}>Go to Chat Room</Text>
          </TouchableOpacity>
          {isAcceptedMember && (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveTrip}
            >
              <View style={styles.leaveButtonContent}>
                <Feather name="log-out" size={20} color="#FF5252" />
                <Text style={styles.leaveButtonText}>Leave Trip</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>

      <DeleteTripModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTrip}
        loading={deleteLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollView: { flex: 1,overflow: Platform.OS === 'web' ? 'auto' : 'hidden', },
  contentPadding: { height: 300 },
  content: { padding: 16 },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: "#374151",
  },
  scrollContentContainer: {
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
  },
  photoGalleryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  galleryPhoto: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  photoCaption: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    width: 200,
  },
  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailItem: { flex: 1, alignItems: "center" },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 2,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  dayHeaderLeft: { flex: 1 },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  dayPlaces: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  dayContent: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  dayNotes: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 16,
    lineHeight: 24,
  },
  placesSection: { marginBottom: 16 },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
    flexDirection: "row",
    alignItems: "center",
  },
  placeItem: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  placeDescription: { fontSize: 14, color: "#4B5563", marginBottom: 4 },
  placeAddress: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  visitDuration: { fontSize: 14, color: "#6366F1", marginBottom: 4 },
  placeCost: { fontSize: 14, fontWeight: "600", color: "#059669" },
  stayCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  stayHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stayTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#1F2937" },
  stayAddress: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  stayDescription: { fontSize: 14, color: "#4B5563", marginBottom: 8 },
  stayDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stayCost: { fontSize: 16, fontWeight: "bold", color: "#059669" },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  stayRating: { fontSize: 16, marginLeft: 4, color: "#1F2937" },
  activitiesSection: { marginBottom: 16 },
  activityItem: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityName: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 4 },
  activityDescription: { fontSize: 14, color: "#4B5563", marginBottom: 4 },
  activityCost: { fontSize: 14, fontWeight: "600", color: "#059669" },
  restaurantsSection: { marginBottom: 16 },
  restaurantItem: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  restaurantName: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 2 },
  mealType: { fontSize: 14, color: "#6366F1", marginBottom: 4 },
  restaurantAddress: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  restaurantDescription: { fontSize: 14, color: "#4B5563", marginBottom: 4 },
  restaurantCost: { fontSize: 14, fontWeight: "600", color: "#059669" },
  essentialsList: { paddingLeft: 8 },
  essentialItem: { fontSize: 16, color: "#4B5563", marginBottom: 8 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#DC2626" },
  hostCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  hostContainer: { flexDirection: "row", alignItems: "center" },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  hostInfo: { flex: 1 },
  hostName: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  hostEmail: { fontSize: 16, color: "#6B7280", marginBottom: 12 },
  contactButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  contactButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  joinButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButtonDisabled: { backgroundColor: "#A5A6F6", opacity: 0.8 },
  joinButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  joinedButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  joinedButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  deleteButton: { padding: 8, marginRight: 8 },
  inviteButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inviteButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  membersContainer: { marginTop: 8 },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hostMemberItem: { backgroundColor: "#EEF2FF" },
  memberPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  hostBadge: { color: "#6366F1", fontWeight: "500" },
  memberStatus: { fontSize: 14, textTransform: "capitalize" },
  acceptedStatus: { color: "#059669" },
  pendingStatus: { color: "#D97706" },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButtonStatus: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 4,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  viewerMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewerMessageText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  leaveButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FF5252',
    borderRadius: 8,
    overflow: 'hidden',
  },
  leaveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  leaveButtonText: {
    marginLeft: 8,
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },
  chatRoomButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  chatRoomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  profileImageWrapper: { marginVertical: 20 },
  profileImageContainer: { position: "relative" },
  profileImage: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: SCREEN_WIDTH * 0.15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
  },
  statItem: { alignItems: "center", flex: 1 },
  statDivider: { width: 1, height: 30, backgroundColor: "#ddd" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#4CAF50" },
  statLabel: { fontSize: 14, color: "#666", marginTop: 4 },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
});

export default TripDetailsScreen;
