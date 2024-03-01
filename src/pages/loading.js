import React from "react";
import {ActivityIndicator, Text, View} from "react-native";

function Loading() {
  return (
    <View className="flex justify-center items-center">
      <ActivityIndicator />
    </View>
  );
}

export default Loading;
