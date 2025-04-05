import { StyleSheet } from 'react-native';

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
      height: 300 
    },
    scrollView: { 
      marginTop: 0 
    },
    content: { 
      padding: 16 
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 16,
      color: "#333",
    },
    sectionContainer: { 
      marginBottom: 24 
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
      flexDirection: "row" 
    },
    starIcon: { 
      marginHorizontal: 4 
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
      marginTop: 16 
    },
    metadata: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    metadataItem: { 
      alignItems: "center" 
    },
    // Trip Card Container
    tripCardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,  // Android shadow
    },
  
    // Trip Card Header
    tripCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
  
    tripCardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
  
    // View Details Button
    viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    viewDetailsText: {
      color: '#6366F1',
      fontSize: 14,
      fontWeight: '600',
      marginRight: 4,  // Space between text and icon
    },
  
    // Trip Card Content
    tripCardContent: {
      paddingTop: 8,
    },
  
    // Metadata Section
    metadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
  
    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      flex: 1,
    },
  
    metadataText: {
      fontSize: 14,
      color: '#555',
      marginLeft: 8,
    },
  
    // Itinerary Preview
    itineraryPreview: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#E8F0FE',
      borderRadius: 8,
    },
  
    itineraryPreviewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
  
    itineraryPreviewText: {
      fontSize: 14,
      color: '#555',
      marginTop: 4,
    },
  
    itineraryPreviewSubtext: {
      fontSize: 12,
      color: '#777',
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
      color: "#666" 
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
      padding: 8 
    },
    modalButtonText: {
      fontSize: 16,
      color: "#4CAF50",
      fontWeight: "600",
    },
    photoContainer: { 
      marginRight: 12 
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
      marginBottom: 12 
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
      flex: 1 
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

export default styles;