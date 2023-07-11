import {Auth, DataStore} from "aws-amplify";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {View, Text, Button, Alert, StyleSheet} from "react-native";
import {Families, User} from "../models";
import MyDatePicker from "./Components/Datepicker";
import TimeLine from "./Components/timeline";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import BottomSheetComponent from "./Components/BottomSheet";

function HomeScreen({navigation}) {
  const [familyName, setFamilyName] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const retrieveEmail = async () => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          // Access the user's email from the user object
          const email = user.attributes.email;
          console.log("User's email:", email);
          queryUser(email);
        })
        .catch((error) => {
          console.log("Error retrieving user:", error);
        });
    };
    const queryUser = async (email) => {
      try {
        // Find the user with the target email address
        const users = await DataStore.query(User);

        console.log(users.filter((u) => u.Email === email)[0]);

        if (users.filter((u) => u.Email === email).length === 0) {
          return;
        } else {
          queryFamily(users.filter((u) => u.Email === email)[0]);
        }
      } catch (error) {
        console.error("Error querying users:", error);
      }
    };

    const queryFamily = async (user) => {
      try {
        const families = await DataStore.query(Families, user.familiesID);

        // Log the families that include the user
        console.log("Families that include the user:", families);
        if (families) {
          setFamilyName(families.Family_Name);
          navigation.setOptions({title: families.Family_Name + " Family"});
        }
      } catch (error) {
        console.error("Error querying families:", error);
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate("Settings")}
          title="Settings"
        />
      ),
    });

    retrieveEmail();
  }, []);

  return (
    <>
      <View className="flex items-center justify-center p-10">
        {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Home2")}
      /> */}
        <MyDatePicker setDate={setDate} />
        <View className="mt-10"></View>
        <TimeLine date={date} />

        {/* <BottomSheetComponent /> */}
      </View>
      <BottomSheetComponent />
    </>
  );
}

export default HomeScreen;
