import BottomSheet, {
  BottomSheetFooter,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {DataStore} from "aws-amplify";
import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  Button,
  Keyboard,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Event, Pet} from "../../models";
import {WrapperContext} from "../wrapper";
import {Picker, PickerIOS} from "@react-native-picker/picker";

const BottomSheetComponent = () => {
  const {family, loading} = useContext(WrapperContext);

  const [desc, onChangeDesc] = React.useState("");

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = React.useState();

  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      const familyId = family.id;
      const subscription = DataStore.observeQuery(Pet, (p) =>
        p.and((p) => [p.familiesID.eq(familyId)])
      ).subscribe((snapshot) => {
        const {items, isSynced} = snapshot;

        setPets(items);
        console.log("FETCHED PETS", pets[0]);
        if (pets.length !== 0) {
          setSelectedPet(items[0]);
        }
      });
    };
    if (!loading) {
      fetchPets();
    }
  }, [loading]);

  const handleSubmit = async () => {
    const fetchedPet = await DataStore.query(Pet, (p) =>
      p.id.eq(selectedPet.id)
    );

    try {
      await DataStore.save(
        // console.log(
        //   "New Event",
        new Event({
          Num1: num1,
          Num2: num2,
          Description: desc,
          Pet: fetchedPet[0],
          familiesID: family.id,
        })
      );
      handleClosePress();
    } catch (err) {
      console.error(err);
    }
  };

  const [num1, setNum1] = useState(false);
  const [num2, setNum2] = useState(false);
  const toggleNum1 = () => setNum1(!num1);
  const toggleNum2 = () => setNum2(!num2);

  const [showFooter, setShowFooter] = React.useState(true);

  const bottomSheetRef = useRef(null);

  const snapPoints = ["10%", "90%"];
  const handleOpenModal = () => bottomSheetRef.current.open();

  const handleClosePress = () => bottomSheetRef.current.snapToIndex(0);

  const pickerRef = useRef();

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <View class="flex flex-row justify-between">
          <Button
            title="Submit"
            onPress={() => {
              handleSubmit();
            }}
          ></Button>
          <Button title="Cancel" onPress={() => handleClosePress()}></Button>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <BottomSheet
      index={0}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{borderRadius: 30}}
      onPress={Keyboard.dismiss}
      footerComponent={pets.length > 0 && showFooter ? renderFooter : null}
      onChange={(index) => {
        if (index === 0) {
          setShowFooter(false);
        } else {
          setShowFooter(true);
        }
      }}
    >
      {pets.length > 0 ? (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex w-screen">
            <View className="flex justify-between">
              <View className="flex items-center">
                <Text className="pt-2 text-xl">Add a new event</Text>
              </View>

              <View className="flex flex-row items-center justify-evenly pt-10">
                <Switch
                  trackColor={{false: "#767577", true: "#81b0ff"}}
                  thumbColor={num1 ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleNum1}
                  value={num1}
                />
                <Text className="text-lg ml-10">Number 1</Text>
              </View>
              <View className="flex flex-row items-center justify-evenly pt-5">
                <Switch
                  trackColor={{false: "#767577", true: "#81b0ff"}}
                  thumbColor={num2 ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleNum2}
                  value={num2}
                />
                <Text className="text-lg ml-10">Number 2</Text>
              </View>
              <View className="flex items-center">
                <PickerIOS
                  selectedValue={selectedPet}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedPet(itemValue)
                  }
                  style={{height: 150, width: 300}}
                >
                  {!pets
                    ? null
                    : pets.map((pet) => (
                        <Picker.Item key={pet} label={pet.Name} value={pet} />
                      ))}
                </PickerIOS>
              </View>
              <View className="flex items-center mt-20">
                <View className="w-3/5">
                  <BottomSheetTextInput
                    className="text-lg"
                    multiline
                    onChangeText={onChangeDesc}
                    value={desc}
                    placeholder="Write a Description"
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View className="mx-10">
          <Text className="text-center pt-2 text-xl">Add a new event</Text>
          <View className="flex justify-center mt-10">
            <Text className="text-center text-lg">
              Please create a pet in settings before adding an event
            </Text>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

export default BottomSheetComponent;
