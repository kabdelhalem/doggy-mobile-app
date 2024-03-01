import {DataStore} from "aws-amplify/datastore";
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {View, Text, Button, Alert, StyleSheet} from "react-native";
import {Families, User} from "../models";
import DateTimePicker from "@react-native-community/datetimepicker";
import TimeLine from "./Components/timeline";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import BottomSheetComponent from "./Components/BottomSheet";

import "../global.css";

function HomeScreen({navigation}) {
  const [familyName, setFamilyName] = useState(null);

  const [date, setDate] = React.useState(new Date());
  console.log("createdd date", date);

  useEffect(() => {
    const retrieveEmail = async () => {
      try {
        const {tokens: session} = await fetchAuthSession();
        console.log("The session: ", session.idToken.payload.email);
        queryUser(session.idToken.payload.email);
      } catch (error) {
        console.log("Error retrieving user:", error);
      }
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

  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(setDate(currentDate));
  };

  return (
    <>
      <View className="flex items-center justify-center p-10">
        {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Home2")}
      /> */}
        <DateTimePicker
          value={date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2016-05-01"
          maxDate="2025-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
            // ... You can check the source to find the other keys.
          }}
          onChange={changeSelectedDate}
        />
        <View className="mt-10"></View>
        <TimeLine date={date} />

        {/* <BottomSheetComponent /> */}
      </View>
      <BottomSheetComponent />
    </>
  );
}

export default HomeScreen;
