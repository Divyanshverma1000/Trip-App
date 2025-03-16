import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Animated, { useSharedValue, FadeInUp } from "react-native-reanimated";
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
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  // Q&A state
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

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

  const currentUserRating =
    blog.ratings.find((rating) => rating.user._id === user.id)?.value || 0;

  const handleRatingSubmit = async (value) => {
    if (ratingSubmitting) return;
    setRatingSubmitting(true);
    try {
      let response;
      if (currentUserRating) {
        response = await updateBlogRating(blog._id, value);
      } else {
        response = await rateBlogPost(blog._id, value);
      }
      // Update local state manually:
      const updatedRatings = blog.ratings.find(
        (rating) => rating.user._id === user.id
      )
        ? blog.ratings.map((rating) =>
            rating.user._id === user.id ? { ...rating, value } : rating
          )
        : [...blog.ratings, { user, value }];
      setBlog({ ...blog, ratings: updatedRatings });
      Alert.alert("Success", "Rating submitted successfully");
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
          <Text style={styles.profilePicText}>
            {question.askedBy.name.charAt(0)}
          </Text>
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
                <Text style={styles.profilePicText}>
                  {answer.answeredBy.name.charAt(0)}
                </Text>
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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cover Image */}
      <Image source={{ uri: blog.coverPhoto }} style={styles.coverImage} />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{blog.title}</Text>

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
                      {star <= currentUserRating ? (
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

          {/* Concerns */}
          {blog.concerns && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Concerns</Text>
              <View style={styles.concernsContainer}>
                {blog.concerns.womenSafety && (
                  <View style={styles.concernItem}>
                    <Text style={styles.concernLabel}>Women Safety:</Text>
                    <Text style={styles.concernValue}>
                      {blog.concerns.womenSafety}/5
                    </Text>
                  </View>
                )}
                {blog.concerns.affordability && (
                  <View style={styles.concernItem}>
                    <Text style={styles.concernLabel}>Affordability:</Text>
                    <Text style={styles.concernValue}>
                      {blog.concerns.affordability}/5
                    </Text>
                  </View>
                )}
                {blog.concerns.culturalExperience && (
                  <View style={styles.concernItem}>
                    <Text style={styles.concernLabel}>
                      Cultural Experience:
                    </Text>
                    <Text style={styles.concernValue}>
                      {blog.concerns.culturalExperience}/5
                    </Text>
                  </View>
                )}
                {blog.concerns.accessibility && (
                  <View style={styles.concernItem}>
                    <Text style={styles.concernLabel}>Accessibility:</Text>
                    <Text style={styles.concernValue}>
                      {blog.concerns.accessibility}/5
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Trip Details & Itinerary */}
          {blog.trip && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Trip Details</Text>
              <View style={styles.metadata}>
                <View style={styles.metadataItem}>
                  <MaterialIcons name="location-on" size={24} color="#6366F1" />
                  <Text>{blog.trip.metadata.destination}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <MaterialIcons name="timer" size={24} color="#6366F1" />
                  <Text>{blog.trip.metadata.duration} days</Text>
                </View>
                <View style={styles.metadataItem}>
                  <MaterialIcons
                    name="attach-money"
                    size={24}
                    color="#6366F1"
                  />
                  <Text>${blog.trip.metadata.cost}</Text>
                </View>
              </View>
              {blog.trip.itinerary && blog.trip.itinerary.length > 0 && (
                <View style={styles.itinerary}>
                  <Text style={styles.sectionHeader}>Itinerary</Text>
                  {blog.trip.itinerary.map((day, index) => (
                    <TouchableOpacity
                      key={day._id}
                      style={styles.dayCard}
                      onPress={() => toggleDayExpansion(index)}
                    >
                      <View style={styles.dayHeader}>
                        <View style={styles.dayHeaderLeft}>
                          <Text style={styles.dayTitle}>Day {day.day}</Text>
                          <Text style={styles.dayPreview} numberOfLines={1}>
                            {day.dayNotes}
                          </Text>
                        </View>
                        <MaterialIcons
                          name={
                            expandedDay === index
                              ? "expand-less"
                              : "expand-more"
                          }
                          size={24}
                          color="#6366F1"
                        />
                      </View>
                      {expandedDay === index && (
                        <Animated.View
                          entering={FadeInUp}
                          style={styles.dayDetails}
                        >
                          <Text style={styles.dayNotes}>{day.dayNotes}</Text>
                          {day.stay && (
                            <View style={styles.detailSection}>
                              <View style={styles.detailTitleContainer}>
                                <MaterialCommunityIcons
                                  name="bed"
                                  size={20}
                                  color="#6366F1"
                                />
                                <Text style={styles.detailTitle}>Stay</Text>
                              </View>
                              <Text style={styles.hotelName}>
                                {day.stay.hotelName}
                              </Text>
                              <Text style={styles.detailText}>
                                {day.stay.description}
                              </Text>
                              <Text style={styles.detailMeta}>
                                Address: {day.stay.address}
                              </Text>
                              <Text style={styles.detailMeta}>
                                Cost: ${day.stay.cost}
                              </Text>
                              <View style={styles.ratingContainer}>
                                <Text>Rating: </Text>
                                {[...Array(day.stay.rating)].map((_, i) => (
                                  <MaterialIcons
                                    key={i}
                                    name="star"
                                    size={16}
                                    color="#FFD700"
                                  />
                                ))}
                              </View>
                            </View>
                          )}
                          {day.places && day.places.length > 0 && (
                            <View style={styles.detailSection}>
                              <View style={styles.detailTitleContainer}>
                                <FontAwesome5
                                  name="map-marker-alt"
                                  size={20}
                                  color="#6366F1"
                                />
                                <Text style={styles.detailTitle}>
                                  Places to Visit
                                </Text>
                              </View>
                              {day.places.map((place) => (
                                <View key={place.name} style={styles.placeItem}>
                                  <Text style={styles.placeName}>
                                    {place.name}
                                  </Text>
                                  <Text style={styles.detailText}>
                                    {place.description}
                                  </Text>
                                  <Text style={styles.detailMeta}>
                                    Time: {place.time}
                                  </Text>
                                  <Text style={styles.detailMeta}>
                                    Cost: ${place.expense}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                          {day.restaurant && day.restaurant.length > 0 && (
                            <View style={styles.detailSection}>
                              <View style={styles.detailTitleContainer}>
                                <MaterialIcons
                                  name="restaurant"
                                  size={20}
                                  color="#6366F1"
                                />
                                <Text style={styles.detailTitle}>Dining</Text>
                              </View>
                              {day.restaurant.map((rest) => (
                                <View
                                  key={rest.name}
                                  style={styles.restaurantItem}
                                >
                                  <Text style={styles.restaurantName}>
                                    {rest.name}
                                  </Text>
                                  <Text style={styles.mealType}>
                                    {rest.mealType}
                                  </Text>
                                  <Text style={styles.detailText}>
                                    {rest.description}
                                  </Text>
                                  <Text style={styles.detailMeta}>
                                    Cost: ${rest.cost}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                          {day.activities && day.activities.length > 0 && (
                            <View style={styles.detailSection}>
                              <View style={styles.detailTitleContainer}>
                                <MaterialCommunityIcons
                                  name="hiking"
                                  size={20}
                                  color="#6366F1"
                                />
                                <Text style={styles.detailTitle}>
                                  Activities
                                </Text>
                              </View>
                              {day.activities.map((activity) => (
                                <View
                                  key={activity._id}
                                  style={styles.activityItem}
                                >
                                  <Text style={styles.activityName}>
                                    {activity.activityName}
                                  </Text>
                                  <Text style={styles.detailText}>
                                    {activity.description}
                                  </Text>
                                  <Text style={styles.detailMeta}>
                                    Cost: ${activity.cost}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: { width: "100%", height: 300 },
  scrollView: { marginTop: 0 },
  content: { padding: 16 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16, color: "#333" },
  sectionContainer: { marginBottom: 24 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4CAF50",
  },
  sectionText: { fontSize: 16, color: "#555", lineHeight: 24 },
  summary: { fontSize: 16, marginBottom: 16, color: "#444" },
  author: { fontSize: 16, color: "#666", marginBottom: 16 },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  averageRatingText: { fontSize: 16, fontWeight: "600" },
  starContainer: { flexDirection: "row", marginLeft: 8 },
  ratingSubmission: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  ratingSubmissionText: { fontSize: 16, marginBottom: 8 },
  starSubmissionContainer: { flexDirection: "row" },
  starIcon: { marginHorizontal: 4 },
  description: { fontSize: 16, marginBottom: 16, color: "#444" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  sectionContent: { fontSize: 16, color: "#444", marginBottom: 16 },
  tripDetails: { marginTop: 16 },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  metadataItem: { alignItems: "center" },
  itinerary: {},
  dayCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  dayHeaderLeft: { flex: 1, marginRight: 8 },
  dayTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  dayPreview: { fontSize: 14, color: "#666" },
  dayDetails: { padding: 16, backgroundColor: "#fff" },
  dayNotes: { fontSize: 16, marginBottom: 12 },
  detailSection: {
    marginVertical: 12,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  detailTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailTitle: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  hotelName: { fontSize: 16, color: "#6366F1", marginBottom: 4 },
  detailText: { fontSize: 14, color: "#666", marginBottom: 4 },
  detailMeta: { fontSize: 13, color: "#888", marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
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
  restaurantName: { fontSize: 15, fontWeight: "600", color: "#6366F1" },
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
  errorText: { fontSize: 16, color: "red" },
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
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
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
  profilePicText: { color: "#fff", fontWeight: "bold" },
  questionInfo: {},
  questionAuthor: { fontSize: 16, fontWeight: "600", color: "#333" },
  questionText: { fontSize: 14, color: "#555" },
  answersContainer: { marginLeft: 48, marginTop: 8 },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  answerInfo: {},
  answerAuthor: { fontSize: 14, fontWeight: "600", color: "#333" },
  answerText: { fontSize: 13, color: "#555" },
  answerButton: { alignSelf: "flex-end", marginTop: 8 },
  answerButtonText: { fontSize: 14, color: "#4CAF50", fontWeight: "600" },
  seeMoreText: { color: "#4CAF50", textAlign: "center", marginTop: 8 },
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
  askQuestionButtonText: { color: "#fff", fontWeight: "600" },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
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
  modalButton: { padding: 8 },
  modalButtonText: { fontSize: 16, color: "#4CAF50", fontWeight: "600" },
  photoContainer: { marginRight: 12 },
  photo: { width: 150, height: 150, borderRadius: 8 },
  photoCaption: { fontSize: 12, color: "#555", marginTop: 4 },
  noPhotos: { justifyContent: "center", alignItems: "center", height: 150 },
  noPhotosText: { color: "#ccc", marginTop: 8 },
  contactItem: { marginBottom: 12 },
  contactLabel: { fontSize: 16, fontWeight: "600", color: "#333" },
  contactText: { fontSize: 14, color: "#555" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 14, color: "#4CAF50" },
  concernsContainer: { flexDirection: "row", flexWrap: "wrap" },
  concernItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  concernLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  concernValue: { fontSize: 14, color: "#555" },
});

export default BlogDetailsScreen;
