import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
  Dimensions
} from 'react-native';
import Animated, { useSharedValue, FadeInUp , useAnimatedScrollHandler } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTrip, joinTrip as joinTripApi, deleteTrip, leaveTrip, changeMemberRole } from '../lib/trips';
import { TripHeader } from '../components/TripHeader';
import { TripTag } from '../components/TripTag';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { getStorageItem } from '../lib/storage';
import { AuthContext } from '../navigation/AppNavigator';
import DeleteTripModal from '../components/DeleteTripModal';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/TripDetailsStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const onScroll = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});
  const { user } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const fetchTripData = async () => {
    if (!tripId) return;
    try {
      setLoading(true); // You might want to set loading instead of just refreshing
      
      // Short delay to make refresh more visible for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = await getTrip(tripId);
      setTrip(data);
    } catch (error) {
      console.error('Failed to refresh trip:', error);
      Alert.alert('Error', 'Failed to refresh trip data');
    } finally {
      setLoading(false);
      setRefreshing(false); // Make sure refreshing is set to false
    }
  };
  

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
        const currentUserId = await getStorageItem('userId');
        setUserId(currentUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
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
          console.error('Failed to fetch trip:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [tripId]);

  const isMember = React.useMemo(() => {
    if (!trip?.members || !user?.id) return false;
    
    return trip.members.some(
      member => member.user._id === user.id && member.status === "accepted"
    );
  }, [trip?.members, user?.id]);

  const isHost = user?.id === trip?.host?._id;

  const joinTrip = async (tripId) => {
    if (joining) return;
    try {
      setJoining(true);
      await joinTripApi(tripId);
      const updatedTrip = await getTrip(tripId);
      setTrip(updatedTrip);
    } catch (error) {
      Alert.alert('Join Failed', error.message || 'Unable to join the trip. Please try again later.');
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
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

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

  const handleChangeMemberRole = async (memberId, currentRole) => {
    const newRole = currentRole === 'editor' ? 'viewer' : 'editor';
    
    Alert.alert(
      'Change Member Role',
      `Change this member's role to ${newRole}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Change',
          onPress: async () => {
            try {
              const updatedTrip = await changeMemberRole(trip._id, memberId, newRole);
              setTrip(updatedTrip);
            } catch (error) {
              console.error('Failed to change member role:', error);
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

  const navigateToChatRoom = () => {
    navigation.navigate("ChatRoomScreen", {
      tripId: trip._id,
      tripName: trip.title,
    });
  };

  if (!tripId || loading || !trip) {
    return (
      <View style={styles.centered}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <Text style={styles.errorText}>
            {!tripId ? 'Error: No trip selected.' : 'Trip not found'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Animated.View style={styles.container}>
      <TripHeader coverPhoto={trip.coverPhoto} title={trip.title} scrollY={scrollY} />


      <Animated.ScrollView
  style={styles.scrollView}
  onScroll={onScroll}
  scrollEventThrottle={16}
  contentInset={{ top: Platform.OS === 'ios' ? 10 : 0 }} // Adds space at the top on iOS
  contentOffset={{ y: Platform.OS === 'ios' ? -10 : 0 }} // Starts scrolled down slightly on iOS
  refreshControl={
    <RefreshControl 
      refreshing={refreshing} 
      onRefresh={fetchTripData}
      colors={["#6366F1"]} // For Android
      tintColor="#6366F1" // For iOS
      title="Refreshing..." // iOS only
      titleColor="#6366F1" // iOS only
      progressBackgroundColor="#ffffff" // Makes the circle more visible
      progressViewOffset={Platform.OS === 'android' ? 80 : 0} // Better position for Android
    />
  }
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
              onPress={() => navigation.navigate('InviteFriends', { tripData: trip})}
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
                <Text style={styles.detailValue}>{trip.metadata.destination}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="calendar-range" size={24} color="#6366F1" />
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{trip.metadata.duration} days</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome5 name="money-bill-wave" size={20} color="#6366F1" />
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>Rs {trip.metadata.cost}</Text>
              </View>
            </View>
          </View>

          {trip.isPublic && !isHost && !isMember && (
  <TouchableOpacity 
    style={[styles.joinButton, joining && styles.joinButtonDisabled]}
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
)}

{trip.isPublic && !isHost && isMember && (
  <TouchableOpacity 
    style={styles.joinedButton}
    onPress={() => Alert.alert('Already Joined', 'You have already joined this trip.')}
  >
    <MaterialIcons name="check-circle" size={24} color="#FFF" />
    <Text style={styles.joinedButtonText}>Already Joined</Text>
  </TouchableOpacity>
)}

          {trip.itinerary?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialCommunityIcons name="map-marker-path" size={24} color="#6366F1" />
                {' Trip Itinerary'}
              </Text>
              {trip.itinerary.map((dayItem, index) => (
                <Animated.View
                  key={index}
                  entering={Platform.OS !== 'web' ? FadeInUp.delay(index * 200) : undefined}
                >
                  <TouchableOpacity 
                    style={styles.dayHeader}
                    onPress={() => toggleDayExpansion(index)}
                  >
                    <View style={styles.dayHeaderLeft}>
                      <Text style={styles.dayNumber}>Day {dayItem.day || index + 1}</Text>
                      <Text style={styles.dayPlaces} numberOfLines={1}>
                        {dayItem.places?.map(place => place.name).join(', ') || 'Places covered'}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={expandedDay === index ? "expand-less" : "expand-more"} 
                      size={24} 
                      color="#6366F1"
                    />
                  </TouchableOpacity>

                  {expandedDay === index && (
                    <View style={styles.dayContent}>
                      <Text style={styles.dayNotes}>{dayItem.dayNotes}</Text>
                      

                      {/* Stay */}
                      {dayItem.stay && (
                        <View style={styles.stayCard}>
                          <View style={styles.stayHeader}>
                            <MaterialIcons name="hotel" size={24} color="#6366F1" />
                            <Text style={styles.stayTitle}>{dayItem.stay.hotelName}</Text>
                          </View>
                          <Text style={styles.stayAddress}>{dayItem.stay.address}</Text>
                          <Text style={styles.stayDescription}>{dayItem.stay.description}</Text>
                          <View style={styles.stayDetails}>
                            <Text style={styles.stayCost}>${dayItem.stay.cost}/night</Text>
                            <View style={styles.ratingContainer}>
                              <MaterialIcons name="star" size={18} color="#FFD700" />
                              <Text style={styles.stayRating}>{dayItem.stay.rating}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                      {/* Places to visit */}
                      {dayItem.places?.length > 0 && (
                        <View style={styles.placesSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialIcons name="place" size={20} color="#6366F1" />
                            {' Places to Visit'}
                          </Text>
                          {dayItem.places.map((place, idx) => (
                            <View key={idx} style={styles.placeItem}>
                              <Text style={styles.placeName}>{place.name}</Text>
                              <Text style={styles.placeDescription}>{place.description}</Text>
                              <Text style={styles.placeAddress}>{place.address}</Text>
                              {place.visitDuration && (
                                <Text style={styles.visitDuration}>Duration: {place.visitDuration}</Text>
                              )}
                              {place.entranceFee && (
                                <Text style={styles.placeCost}>Entrance Fee: ${place.entranceFee}</Text>
                              )}
                            </View>
                          ))}
                        </View>
                      )}
                      {/* Activities */}
                      {dayItem.activities?.length > 0 && (
                        <View style={styles.activitiesSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialCommunityIcons name="hiking" size={20} color="#6366F1" />
                            {' Activities'}
                          </Text>
                          {dayItem.activities.map((activity, idx) => (
                            <View key={idx} style={styles.activityItem}>
                              <Text style={styles.activityName}>{activity.activityName}</Text>
                              <Text style={styles.activityDescription}>{activity.description}</Text>
                              <Text style={styles.activityCost}>${activity.cost}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {/* Restaurants */}
                      {dayItem.restaurant?.length > 0 && (
                        <View style={styles.restaurantsSection}>
                          <Text style={styles.subSectionTitle}>
                            <MaterialCommunityIcons name="food" size={20} color="#6366F1" />
                            {' Restaurants'}
                          </Text>
                          {dayItem.restaurant.map((rest, idx) => (
                            <View key={idx} style={styles.restaurantItem}>
                              <Text style={styles.restaurantName}>{rest.name}</Text>
                              <Text style={styles.mealType}>{rest.mealType}</Text>
                              <Text style={styles.restaurantAddress}>{rest.address}</Text>
                              <Text style={styles.restaurantDescription}>{rest.description}</Text>
                              <Text style={styles.restaurantCost}>${rest.cost}</Text>
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
                <MaterialCommunityIcons name="bag-personal" size={24} color="#6366F1" />
                {' Packing Essentials'}
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
                <MaterialCommunityIcons name="tag-multiple" size={24} color="#6366F1" />
                {' Trip Tags'}
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
                {' Trip Host'}
              </Text>
              <View style={styles.hostContainer}>
                {trip.host.photo && (
                  <Image source={{ uri: trip.host.photo }} style={styles.hostImage} />
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
          {/* Trip Members */}
          {trip.members?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name="people" size={24} color="#6366F1" />
                {' Trip Members'}
              </Text>
              <View style={styles.membersContainer}>
                {trip.members
                .filter(member => member.status !== 'pending')
                .map((member) => (
                  <View 
                    key={member.user._id} 
                    style={[
                      styles.memberItem,
                      member.user._id === trip.host._id && styles.hostMemberItem
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
                      <View style={styles.memberStatusRow}>
                        <Text style={[
                          styles.memberStatus,
                          member.status === 'accepted' && styles.acceptedStatus,
                          member.status === 'pending' && styles.pendingStatus
                        ]}>
                          {member.status}
                        </Text>
                        {member.status === 'accepted' && member.role !== 'host' && (
                          <Text style={styles.memberRole}>
                            • {member.role || 'viewer'}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isHost && member.user._id !== trip.host._id && member.status === 'accepted' && (
                      <TouchableOpacity
                        style={styles.roleEditButton}
                        onPress={() => handleChangeMemberRole(member.user._id, member.role || 'viewer')}
                      >
                        <Feather name="edit-2" size={16} color="#6366F1" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
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

{/* Floating Chat Button - Only shown to members */}
{(isHost || isMember) && (
  <TouchableOpacity 
    style={styles.chatButton}
    onPress={navigateToChatRoom}
    activeOpacity={0.8}
  >
    <MaterialIcons name="chat" size={28} color="#fff" />
  </TouchableOpacity>
)}

      <DeleteTripModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTrip}
        loading={deleteLoading}
        />
    </Animated.View>
  );
};



export default TripDetailsScreen;