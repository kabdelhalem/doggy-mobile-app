import {FlashList} from "@shopify/flash-list";
import React, {useContext, useEffect, useState} from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
} from "react-native";
import {WrapperContext} from "./wrapper";
import {DataStore} from "aws-amplify/datastore";
import {Families, Pet, User} from "../models";
import {ScrollView, TextInput} from "react-native-gesture-handler";
import {useAuthenticator} from "@aws-amplify/ui-react-native";
import Modal from "react-native-modal";
import * as Clipboard from "expo-clipboard";
function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}
const Settings = () => {
  const {family, loading} = useContext(WrapperContext);

  const [users, setUsers] = useState(null);
  const [pets, setPets] = useState(null);

  const [addNewDog, setAddNewDog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const familyId = family.id;

      const UserSubscription = DataStore.observeQuery(User, (f) =>
        f.and((f) => [f.familiesID.eq(familyId)])
      ).subscribe((snapshot) => {
        const {items, isSynced} = snapshot;
        console.log("FAMILIES", items);
        setUsers(items);
      });

      const PetSubscription = DataStore.observeQuery(Pet, (f) =>
        f.and((f) => [f.familiesID.eq(familyId)])
      ).subscribe((snapshot) => {
        const {items, isSynced} = snapshot;
        console.log("FAMILIES", items);
        setPets(items);
      });
    };
    if (!loading) {
      fetchData();
      console.log("data fethced");
    }
  }, [loading]);

  const copyToClipboard = () => {
    Clipboard.setStringAsync(family.id);
    Alert.alert(
      "Family ID Copied",
      "Send this id to invite others to your family",
      [{text: "OK", onPress: () => null}]
    );
  };

  const toggleAddNewDog = () => {
    setAddNewDog(!addNewDog);
  };

  const [newDogName, onChangeNewDogName] = React.useState("");

  const handleAddNewDog = async () => {
    try {
      await DataStore.save(
        new Pet({
          Name: newDogName,
          familiesID: family.id,
        })
      );
      onChangeNewDogName("");
      toggleAddNewDog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex items-center ">
      <View className="flex justify-between">
        <View className="flex items-center">
          <View className="flex flex-row items-center justify-evenly">
            <Text className="pt-2 text-xl mr-3">Family</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Image
                className="w-5 h-5 mt-2"
                source={require("../images/copy.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          {!users ? null : (
            <ScrollView
              style={{height: 20, width: Dimensions.get("screen").width}}
            >
              <FlashList
                data={users}
                renderItem={({item}) => (
                  <View className="flex flex-row mx-10 mt-2 divide-solid bg-white p-4 items-center rounded-lg">
                    <Image
                      className="w-10 h-10"
                      source={require("../images/user.png")}
                    ></Image>
                    <View className="flex flex-col ml-10">
                      <Text>{item.Name}</Text>
                      <Text>{item.Email}</Text>
                    </View>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </ScrollView>
          )}

          <Text className="pt-2 text-xl">Pets</Text>
          <Button title="Add New" onPress={toggleAddNewDog}></Button>
          <Modal isVisible={addNewDog}>
            <View className="flex items-center bg-white rounded-2xl">
              <Text className="text-xl mt-5">Add a new Dog</Text>
              <TextInput
                className="text-lg mt-3"
                onChangeText={onChangeNewDogName}
                value={newDogName}
                placeholder="Milou"
              ></TextInput>
              <View className="flex flex-row justify-between my-5">
                <Button
                  title="Cancel"
                  onPress={() => {
                    toggleAddNewDog();
                    onChangeNewDogName("");
                  }}
                ></Button>
                <Button
                  title="Submit"
                  onPress={() => handleAddNewDog()}
                ></Button>
              </View>
            </View>
          </Modal>
          {!pets ? null : (
            <ScrollView
              style={{height: 20, width: Dimensions.get("screen").width}}
            >
              <FlashList
                data={pets}
                renderItem={({item}) => (
                  <View className="flex flex-row mx-10 mt-2 divide-solid bg-white p-4 items-center rounded-lg">
                    <Image
                      className="w-10 h-10"
                      source={require("../images/dog.png")}
                    ></Image>
                    <View className="flex flex-col ml-10">
                      <Text>{item.Name}</Text>
                    </View>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </ScrollView>
          )}
          <SignOutButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
