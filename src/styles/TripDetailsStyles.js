import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    scrollView: { flex: 1 },
    contentPadding: { height: 300 },
    headerContainer: {
       zIndex: 10, // Ensure header stays on top
    },
    content: { padding: 16 },
    description: { 
      fontSize: 16, 
      marginBottom: 16,
      lineHeight: 24,
      color: '#374151'
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
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
    },
    sectionTitle: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      marginBottom: 16,
      color: '#1F2937',
      flexDirection: 'row',
      alignItems: 'center'
    },
    subSectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: '#374151',
      flexDirection: 'row',
      alignItems: 'center'
    },
    detailsGrid: { 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    detailItem: { 
      flex: 1,
      alignItems: 'center'
    },
    detailLabel: { 
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4
    },
    detailValue: { 
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      marginTop: 2
    },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      marginBottom: 8,
    },
    dayHeaderLeft: { flex: 1 },
    dayNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1F2937',
    },
    dayPlaces: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
    },
    dayContent: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 16,
    },
    dayNotes: {
      fontSize: 16,
      color: '#4B5563',
      marginBottom: 16,
      lineHeight: 24,
    },
    placesSection: {
      marginBottom: 16,
    },
    placeItem: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    placeName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    placeDescription: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 4,
    },
    placeAddress: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
    },
    visitDuration: {
      fontSize: 14,
      color: '#6366F1',
      marginBottom: 4,
    },
    placeCost: {
      fontSize: 14,
      fontWeight: '600',
      color: '#059669',
    },
    stayCard: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    stayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    stayTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      color: '#1F2937',
    },
    stayAddress: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 8,
    },
    stayDescription: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 8,
    },
    stayDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    stayCost: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#059669',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stayRating: {
      fontSize: 16,
      marginLeft: 4,
      color: '#1F2937',
    },
    activitiesSection: {
      marginBottom: 16,
    },
    activityItem: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    activityName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    activityDescription: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 4,
    },
    activityCost: {
      fontSize: 14,
      fontWeight: '600',
      color: '#059669',
    },
    restaurantsSection: {
      marginBottom: 16,
    },
    restaurantItem: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    restaurantName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 2,
    },
    mealType: {
      fontSize: 14,
      color: '#6366F1',
      marginBottom: 4,
    },
    restaurantAddress: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
    },
    restaurantDescription: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 4,
    },
    restaurantCost: {
      fontSize: 14,
      fontWeight: '600',
      color: '#059669',
    },
    essentialsList: {
      paddingLeft: 8,
    },
    essentialItem: {
      fontSize: 16,
      color: '#4B5563',
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
      color: '#DC2626',
    },
    hostCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    hostContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    hostImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    hostInfo: { flex: 1 },
    hostName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
    },
    hostEmail: {
      fontSize: 16,
      color: '#6B7280',
      marginBottom: 12,
    },
    contactButton: {
      backgroundColor: '#6366F1',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    joinButton: {
      backgroundColor: '#6366F1',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    joinButtonDisabled: {
      backgroundColor: '#A5A6F6',
      opacity: 0.8,
    },
    joinButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    joinedButton: {
      backgroundColor: '#10B981',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    joinedButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    deleteButton: {
      padding: 8,
      marginRight: 8,
    },
    inviteButton: {
      backgroundColor: '#4CAF50',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    inviteButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    membersContainer: {
      marginTop: 8
    },
    memberStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    memberRole: {
      fontSize: 14,
      marginLeft: 6,
      color: '#6b7280', // gray-500
    },
    roleEditButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#e0e7ff', // indigo-100
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8
    },
    hostMemberItem: {
      backgroundColor: '#EEF2FF'
    },
    memberPhoto: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12
    },
    memberInfo: {
      flex: 1
    },
    memberName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4
    },
    hostBadge: {
      color: '#6366F1',
      fontWeight: '500'
    },
    memberStatus: {
      fontSize: 14,
      textTransform: 'capitalize'
    },
    acceptedStatus: {
      color: '#059669'
    },
    pendingStatus: {
      color: '#D97706'
    },
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
    chatButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 1000,
    },
  });


export default styles;