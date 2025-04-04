import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Alert,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTrips } from "../hooks/useTrips";
import { AuthContext } from "../navigation/AppNavigator";
import TripCard from "../components/TripCard";
import { Feather } from "@expo/vector-icons";
import DeleteTripModal from "../components/DeleteTripModal";
import { deleteTrip } from "../lib/trips";
import { getBlogPosts } from "../lib/blogs";
import * as ImagePicker from "expo-image-picker";
import { updateProfilePhoto, getProfile } from "../lib/user";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 cards per row with padding

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, updateUser, logout } = useContext(AuthContext);
  const { myTrips, loading, error, fetchMyTrips } = useTrips();
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchMyTrips();
      fetchUserBlogs();
    }
  }, [user, fetchMyTrips]);

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTrip(tripToDelete._id);
      // Refresh trips list
      fetchMyTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setDeleteLoading(false);
      setTripToDelete(null);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const blogs = await getBlogPosts();
      const myBlogs = blogs.filter(
        (blog) => blog.host && blog.host._id === user.id
      );
      setUserBlogs(myBlogs);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to update your profile photo."
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        await uploadPhoto(selectedImage);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error picking image",
        text2: "Please try again",
      });
    }
  };

  const uploadPhoto = async (imageFile) => {
    setUploading(true);
    try {
      // Create the photo object expected by the API
      const photo = {
        uri: imageFile.uri,
        fileName: imageFile.uri.split("/").pop() || "photo.jpg",
        type: "image/jpeg", // You might want to detect this from the file
      };

      const updatedUser = await updateProfilePhoto(photo);

      // Update the local user state with the new photo
      updateUser({
        ...user,
        photo: updatedUser.photo,
      });

      Toast.show({
        type: "success",
        text1: "Profile photo updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to update profile photo",
        text2: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMyTrips();
      await fetchUserBlogs();

      Toast.show({
        type: "success",
        text1: "Profile and trips updated",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to refresh profile",
        text2: error.message,
      });
    } finally {
      setRefreshing(false);
    }
  }, [updateUser, fetchMyTrips]);

  const renderTripCard = ({ item, index }) => {
    return (
      <TripCard
        trip={item}
        style={[
          styles.tripCard,
          index % 2 === 0 ? styles.tripCardLeft : styles.tripCardRight,
        ]}
        onPress={() =>
          navigation.navigate("TripDetailsScreen", { tripId: item._id })
        }
        showDeleteOption={true}
        onDelete={setTripToDelete}
      />
    );
  };

  const onCreateNewTrip = () => {
    navigation.navigate("CreateTrip");
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E7033" />

      <LinearGradient
        colors={["#1E7033", "#4CAF50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#FF5252" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]} // Android
            tintColor="#4CAF50" // iOS
            title="Pull to refresh" // iOS
            titleColor="#4CAF50" // iOS
          />
        }
      >
        {/* Profile Header Section with Card Design */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: user?.photo || "https://via.placeholder.com/150",
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editPhotoButton}
                onPress={handleImagePick}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Feather name="camera" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{myTrips.length || 0}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userBlogs?.length || 0}</Text>
              <Text style={styles.statLabel}>Blogs</Text>
            </View>
          </View>
        </View>

        {/* Trips Section with improved layout */}
        <View style={styles.tripsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Trips</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={onCreateNewTrip}
            >
              <Feather name="plus" size={20} color="#4CAF50" />
              <Text style={styles.addButtonText}>New Trip</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#4CAF50"
              style={styles.loader}
            />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : myTrips?.length > 0 ? (
            <FlatList
              data={myTrips}
              renderItem={renderTripCard}
              keyExtractor={(item) => item._id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.tripGrid}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="map" size={48} color="#DADADA" />
              <Text style={styles.emptyStateText}>No trips yet</Text>
              <TouchableOpacity
                style={styles.createTripButton}
                onPress={onCreateNewTrip}
              >
                <Text style={styles.createTripText}>
                  Create Your First Trip
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <DeleteTripModal
        visible={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDeleteTrip}
        loading={deleteLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 30 : 30,
    paddingBottom: 16,
    backgroundColor: "#4CAF50",
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    alignItems: "center",
    margin: 16,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  profileImageWrapper: {
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    borderRadius: SCREEN_WIDTH * 0.125,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
    marginTop: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#ddd",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  tripsSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  tripGrid: {
    paddingHorizontal: 0,
  },
  tripCard: {
    flex: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  tripCardLeft: {
    marginRight: 8,
  },
  tripCardRight: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  createTripButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  createTripText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 32,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
});

export default ProfileScreen;
