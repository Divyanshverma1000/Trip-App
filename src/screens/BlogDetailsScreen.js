import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Animated, {
  useSharedValue,
  FadeInUp,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  getBlogPostById,
  rateBlogPost,
  updateBlogRating,
  getQuestions,
  askQuestion,
  answerQuestion,
} from "../lib/blogs";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { TripHeader } from "../components/TripHeader";
import { AuthContext } from "../navigation/AppNavigator";

const BlogDetailsScreen = () => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const blogId = route?.params?.blogId;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  // Q&A state
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  // Local state for current user's rating (optimistic update)
  const [userRating, setUserRating] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogData = async () => {
    if (!blogId) return;
    try {
      setLoading(true); // Start refresh animation
      const data = await getBlogPostById(blogId); // Fetch latest blog data
      setBlog(data); // Update state with new blog data
      await fetchQuestions(); // Refresh questions as well
    } catch (error) {
      console.error("Failed to refresh blog:", error);
      Alert.alert("Error", "Failed to refresh blog data");
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refresh animation
    }
  };

  useEffect(() => {
    if (blogId) {
      setLoading(true);
      getBlogPostById(blogId)
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch blog:", error);
          setLoading(false);
        });
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [blogId]);

  // Update local userRating when blog data changes
  useEffect(() => {
    if (blog && blog.ratings) {
      const foundRating = blog.ratings.find(
        (rating) => String(rating.user._id) === String(user.id)
      );
      setUserRating(foundRating ? foundRating.value : 0);
    }
  }, [blog, user.id]);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const qs = await getQuestions(blogId);
      setQuestions(qs);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (!blogId || loading || !blog) {
    return (
      <View style={styles.centered}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <Text style={styles.errorText}>
            {!blogId ? "Error: No blog selected." : "Blog not found"}
          </Text>
        )}
      </View>
    );
  }

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!blog.ratings || blog.ratings.length === 0) return 0;
    const sum = blog.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return (sum / blog.ratings.length).toFixed(1);
  };

  const handleRatingSubmit = async (value) => {
    if (ratingSubmitting) return;

    // Optimistically update UI
    setUserRating(value);
    setRatingSubmitting(true);
    try {
      let response;
      // If a rating already exists (userRating is not 0), update it; otherwise, create one.
      if (userRating) {
        response = await updateBlogRating(blog._id, value);
      } else {
        response = await rateBlogPost(blog._id, value);
      }
      // Update local blog state manually:
      const userId = String(user.id);
      const index = blog.ratings.findIndex(
        (rating) => String(rating.user._id) === userId
      );
      const updatedRatings = [...blog.ratings];
      if (index !== -1) {
        updatedRatings[index] = { ...updatedRatings[index], value };
      } else {
        updatedRatings.push({ user, value });
      }
      setBlog({ ...blog, ratings: updatedRatings });
      // Alert.alert("Success", "Rating submitted successfully");
    } catch (error) {
      console.error("Rating submission failed:", error);
      Alert.alert("Error", "Could not submit rating");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const toggleDayExpansion = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const canRate = blog.host._id !== user.id;

  // Q&A Handlers
  const handleAskQuestion = async () => {
    if (!newQuestionText.trim()) return;
    try {
      await askQuestion(blog._id, newQuestionText.trim());
      setNewQuestionText("");
      fetchQuestions();
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswerText("");
    setAnswerModalVisible(true);
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !selectedQuestion) return;
    try {
      await answerQuestion(selectedQuestion._id, answerText.trim());
      setAnswerModalVisible(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const renderQuestion = (question) => (
    <View key={question._id} style={styles.questionContainer}>
      <View style={styles.questionHeader}>
        <View style={styles.profilePicPlaceholder}>
          {question.askedBy.photo ? (
            <Image
              source={{ uri: question.askedBy.photo }}
              style={styles.profilePicImage} // Define this in your styles
            />
          ) : (
            <Text style={styles.profilePicText}>
              {question.askedBy.name.charAt(0)}
            </Text>
          )}
        </View>
        <View style={styles.questionInfo}>
          <Text style={styles.questionAuthor}>{question.askedBy.name}</Text>
          <Text style={styles.questionText}>{question.questionText}</Text>
        </View>
      </View>
      {question.answers && question.answers.length > 0 && (
        <View style={styles.answersContainer}>
          {question.answers.map((answer) => (
            <View key={answer.createdAt} style={styles.answerContainer}>
              <View style={styles.profilePicPlaceholderSmall}>
                {answer.answeredBy.photo ? (
                  <Image
                    source={{ uri: answer.answeredBy.photo }}
                    style={styles.profilePicImageSmall} // Define this in your styles
                  />
                ) : (
                  <Text style={styles.profilePicText}>
                    {answer.answeredBy.name.charAt(0)}
                  </Text>
                )}
              </View>
              <View style={styles.answerInfo}>
                <Text style={styles.answerAuthor}>
                  {answer.answeredBy.name}
                </Text>
                <Text style={styles.answerText}>{answer.answerText}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity
        onPress={() => openAnswerModal(question)}
        style={styles.answerButton}
      >
        <Text style={styles.answerButtonText}>Answer</Text>
      </TouchableOpacity>
    </View>
  );

  const displayedQuestions = showAllQuestions
    ? questions
    : questions.slice(0, 3);

  return (
    <View style={styles.container}>
      {/*       
     
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>


      <Image source={{ uri: blog.coverPhoto }} style={styles.coverImage} /> 
    */}

      <TripHeader
        coverPhoto={blog.coverPhoto}
        title={blog.title}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentInset={{ top: Platform.OS === "ios" ? 10 : 0 }} // Adds space at the top on iOS
        contentOffset={{ y: Platform.OS === "ios" ? -10 : 0 }} // Starts scrolled down slightly on iOS
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchBlogData}
            colors={["#6366F1"]} // For Android
            tintColor="#6366F1" // For iOS
            title="Refreshing..." // iOS only
            titleColor="#6366F1" // iOS only
            progressBackgroundColor="#ffffff" // Makes the circle more visible
            progressViewOffset={Platform.OS === "android" ? 80 : 0} // Better position for Android
          />
        }
      >
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>{blog.title}</Text>
          </View>

          {blog.host && (
            <View style={[styles.sectionContainer, styles.hostCardWrapper]}>
              <View style={styles.hostCard}>
                <Text style={styles.sectionTitle}>
                  <MaterialIcons name="person" size={24} color="#6366F1" />
                  {"Posted by:"}
                </Text>
                <View style={styles.hostContainer}>
                  {blog.host.photo && (
                    <Image
                      source={{ uri: blog.host.photo }}
                      style={styles.hostImage}
                    />
                  )}
                  <View style={styles.hostInfo}>
                    <Text style={styles.hostName}>{blog.host.name}</Text>
                    <Text style={styles.hostEmail}>{blog.host.email}</Text>
                    <TouchableOpacity style={styles.contactButton}>
                      <MaterialIcons name="mail" size={20} color="#FFF" />
                      <Text style={styles.contactButtonText}> Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Summary Section */}
          {blog.summary && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Summary</Text>
              <Text style={styles.sectionText}>{blog.summary}</Text>
            </View>
          )}

          {/* Ratings */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Ratings</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.averageRatingText}>
                Average Rating: {calculateAverageRating()}{" "}
              </Text>
              {blog.ratings.length > 0 && (
                <View style={styles.starContainer}>
                  {[...Array(Math.round(calculateAverageRating()))].map(
                    (_, i) => (
                      <MaterialIcons
                        key={i}
                        name="star"
                        size={20}
                        color="#FFD700"
                      />
                    )
                  )}
                </View>
              )}
            </View>
            {canRate && (
              <View style={styles.ratingSubmission}>
                <Text style={styles.ratingSubmissionText}>Rate this post:</Text>
                <View style={styles.starSubmissionContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRatingSubmit(star)}
                      disabled={ratingSubmitting}
                    >
                      {star <= userRating ? (
                        <MaterialIcons
                          name="star"
                          size={32}
                          color="#FFD700"
                          style={styles.starIcon}
                        />
                      ) : (
                        <MaterialIcons
                          name="star-border"
                          size={32}
                          color="#ccc"
                          style={styles.starIcon}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Description Section */}
          {blog.description && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Description</Text>
              <Text style={styles.sectionText}>{blog.description}</Text>
            </View>
          )}

          {/* Recommendations & Advisory */}
          {(blog.recommendations || blog.advisory) && (
            <View style={styles.sectionContainer}>
              {blog.recommendations && (
                <>
                  <Text style={styles.sectionHeader}>Recommendations</Text>
                  <Text style={styles.sectionText}>{blog.recommendations}</Text>
                </>
              )}
              {blog.advisory && (
                <>
                  <Text style={styles.sectionHeader}>Advisory</Text>
                  <Text style={styles.sectionText}>{blog.advisory}</Text>
                </>
              )}
            </View>
          )}

          {/* Concerns */}
          {blog.concerns && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Concerns</Text>
              <View style={styles.concernsContainer}>
                {blog.concerns.womenSafety && (
                  <View style={styles.concernItem}>
                    <View style={styles.iconContainer}>
                      <Icon name="shield" size={16} color="#E91E63" />
                    </View>
                    <Text style={styles.concernLabel}>Women Safety:</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name={
                            i < blog.concerns.womenSafety
                              ? "star"
                              : "star-outline"
                          }
                          size={14}
                          color={
                            i < blog.concerns.womenSafety
                              ? "#E91E63"
                              : "#BDBDBD"
                          }
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {blog.concerns.affordability && (
                  <View style={styles.concernItem}>
                    <View style={styles.iconContainer}>
                      <Icon name="wallet" size={16} color="#4CAF50" />
                    </View>
                    <Text style={styles.concernLabel}>Affordability:</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name={
                            i < blog.concerns.affordability
                              ? "star"
                              : "star-outline"
                          }
                          size={14}
                          color={
                            i < blog.concerns.affordability
                              ? "#4CAF50"
                              : "#BDBDBD"
                          }
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {blog.concerns.culturalExperience && (
                  <View style={styles.concernItem}>
                    <View style={styles.iconContainer}>
                      <Icon name="celebration" size={16} color="#FF9800" />
                    </View>
                    <Text style={styles.concernLabel}>
                      Cultural Experience:
                    </Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name={
                            i < blog.concerns.culturalExperience
                              ? "star"
                              : "star-outline"
                          }
                          size={14}
                          color={
                            i < blog.concerns.culturalExperience
                              ? "#FF9800"
                              : "#BDBDBD"
                          }
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {blog.concerns.accessibility && (
                  <View style={styles.concernItem}>
                    <View style={styles.iconContainer}>
                      <Icon name="accessibility" size={16} color="#2196F3" />
                    </View>
                    <Text style={styles.concernLabel}>Accessibility:</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name={
                            i < blog.concerns.accessibility
                              ? "star"
                              : "star-outline"
                          }
                          size={14}
                          color={
                            i < blog.concerns.accessibility
                              ? "#2196F3"
                              : "#BDBDBD"
                          }
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Photo Gallery */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Photos</Text>
            {blog.photos && blog.photos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {blog.photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo.url }} style={styles.photo} />
                    {photo.caption && (
                      <Text style={styles.photoCaption}>{photo.caption}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noPhotos}>
                <Ionicons name="image-outline" size={40} color="#ccc" />
                <Text style={styles.noPhotosText}>No photos present</Text>
              </View>
            )}
          </View>

          {/* Contact Info */}
          {blog.contactInfo && blog.contactInfo.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Contact Information</Text>
              {blog.contactInfo.map((contact, idx) => (
                <View key={idx} style={styles.contactItem}>
                  <Text style={styles.contactLabel}>{contact.label}</Text>
                  {contact.phone && (
                    <Text style={styles.contactText}>
                      Phone: {contact.phone}
                    </Text>
                  )}
                  {contact.email && (
                    <Text style={styles.contactText}>
                      Email: {contact.email}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Tags & Budget */}
          {(blog.tags && blog.tags.length > 0) || blog.budget ? (
            <View style={styles.sectionContainer}>
              {blog.tags && blog.tags.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {blog.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
              {blog.budget && (
                <>
                  <Text style={styles.sectionHeader}>Budget</Text>
                  <Text style={styles.sectionText}>${blog.budget}</Text>
                </>
              )}
            </View>
          ) : null}

          {/* Trip Details */}
          {blog.trip && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Trip Details</Text>
              <TouchableOpacity
                style={styles.tripCardContainer}
                onPress={() =>
                  navigation.navigate("TripDetailsScreen", {
                    tripId: blog.trip._id,
                  })
                }
              >
                <View style={styles.tripCardHeader}>
                  <Text style={styles.tripCardTitle}>
                    {blog.trip.title || "Trip Overview"}
                  </Text>
                  <View style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Full Trip</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      color="#6366F1"
                    />
                  </View>
                </View>

                <View style={styles.tripCardContent}>
                  <View style={styles.metadata}>
                    <View style={styles.metadataItem}>
                      <MaterialIcons
                        name="location-on"
                        size={24}
                        color="#6366F1"
                      />
                      <Text style={styles.metadataText}>
                        {blog.trip.metadata?.destination || "Unknown location"}
                      </Text>
                    </View>
                    <View style={styles.metadataItem}>
                      <MaterialIcons name="timer" size={24} color="#6366F1" />
                      <Text style={styles.metadataText}>
                        {blog.trip.metadata?.duration || "?"} days
                      </Text>
                    </View>
                    <View style={styles.metadataItem}>
                      <MaterialIcons
                        name="attach-money"
                        size={24}
                        color="#6366F1"
                      />
                      <Text style={styles.metadataText}>
                        $
                        {blog.trip.metadata?.cost ||
                          blog.trip.estimatedBudget ||
                          "?"}
                      </Text>
                    </View>
                  </View>

                  {blog.trip.itinerary && blog.trip.itinerary.length > 0 && (
                    <View style={styles.itineraryPreview}>
                      <Text style={styles.itineraryPreviewTitle}>
                        Itinerary Preview:
                      </Text>
                      <Text style={styles.itineraryPreviewText}>
                        {blog.trip.itinerary.length} day
                        {blog.trip.itinerary.length > 1 ? "s" : ""} planned
                      </Text>
                      <Text style={styles.itineraryPreviewSubtext}>
                        Tap to see full itinerary details
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Q&A Section */}
          <View style={styles.qaSection}>
            <Text style={styles.qaHeader}>Questions & Answers</Text>
            {loadingQuestions ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <>
                {displayedQuestions.map((question) => renderQuestion(question))}
                {questions.length > 3 && !showAllQuestions && (
                  <TouchableOpacity onPress={() => setShowAllQuestions(true)}>
                    <Text style={styles.seeMoreText}>See more questions</Text>
                  </TouchableOpacity>
                )}
                {questions.length > 3 && showAllQuestions && (
                  <TouchableOpacity onPress={() => setShowAllQuestions(false)}>
                    <Text style={styles.seeMoreText}>Show less</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <View style={styles.askQuestionContainer}>
              <TextInput
                style={styles.askQuestionInput}
                placeholder="Ask a question..."
                value={newQuestionText}
                onChangeText={setNewQuestionText}
              />
              <TouchableOpacity
                style={styles.askQuestionButton}
                onPress={handleAskQuestion}
              >
                <Text style={styles.askQuestionButtonText}>Ask</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Answer Modal */}
      <Modal
        visible={answerModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAnswerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Answer Question</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your answer..."
              value={answerText}
              onChangeText={setAnswerText}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setAnswerModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAnswerSubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16, // Add inner spacing for overall layout
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 300,
  },
  scrollView: {
    marginTop: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4CAF50",
  },
  sectionText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  summary: {
    fontSize: 16,
    marginBottom: 16,
    color: "#444",
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  starContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  ratingSubmission: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  ratingSubmissionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  starSubmissionContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  sectionContent: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
  tripDetails: {
    marginTop: 16,
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  metadataItem: {
    alignItems: "center",
  },
  // Trip Card Container
  tripCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },

  // Trip Card Header
  tripCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  tripCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  // View Details Button
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewDetailsText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4, // Space between text and icon
  },

  // Trip Card Content
  tripCardContent: {
    paddingTop: 8,
  },

  // Metadata Section
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    flex: 1,
  },

  metadataText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },

  // Itinerary Preview
  itineraryPreview: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#E8F0FE",
    borderRadius: 8,
  },

  itineraryPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  itineraryPreviewText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  itineraryPreviewSubtext: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  dayCard: {
    backgroundColor: "#fff", // White background for a clean card look
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  dayPreview: {
    fontSize: 14,
    color: "#666",
  },
  dayDetails: {
    padding: 16,
    backgroundColor: "#fff",
  },
  dayNotes: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
  },
  detailSection: {
    marginVertical: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  detailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  hotelName: {
    fontSize: 16,
    color: "#6366F1",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailMeta: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  placeItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  placeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 4,
  },
  restaurantItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6366F1",
  },
  mealType: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 4,
  },
  activityItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  qaSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  qaHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  questionContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profilePicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  profilePicPlaceholderSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  profilePicText: {
    color: "#fff",
    fontWeight: "bold",
  },
  questionInfo: {},
  questionAuthor: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  questionText: {
    fontSize: 14,
    color: "#555",
  },
  answersContainer: {
    marginLeft: 48,
    marginTop: 8,
  },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  answerInfo: {},
  answerAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  answerText: {
    fontSize: 13,
    color: "#555",
  },
  answerButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  answerButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  seeMoreText: {
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 8,
  },
  askQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  askQuestionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  askQuestionButton: {
    marginLeft: 8,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  askQuestionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  photoCaption: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  noPhotos: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  noPhotosText: {
    color: "#ccc",
    marginTop: 8,
  },
  contactItem: {
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  contactText: {
    fontSize: 14,
    color: "#555",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  concernsContainer: {
    marginTop: 8,
  },
  concernItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  concernLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
    flex: 1,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  hostCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hostContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  hostEmail: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  hostCardWrapper: {
    marginTop: 230,
    zIndex: 1,
  },
  contactButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  profilePicImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePicImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default BlogDetailsScreen;
