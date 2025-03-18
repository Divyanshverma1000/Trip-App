import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StarRating = ({ rating, onChange }) => {
  return (
    <View style={{ flexDirection: "row", marginVertical: 5 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <MaterialIcons
            name={star <= rating ? "star" : "star-border"}
            size={30}
            color={star <= rating ? "#FFD700" : "#CCC"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;
