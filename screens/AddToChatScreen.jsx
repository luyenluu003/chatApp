import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const AddToChatScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const createNewChat = async () => {
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatName: addChat,
      password: password,
      title: title,
    };

    if (addChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          setPassword("");
          navigation.replace("HomeScreen");
        })
        .catch((err) => {
          alert("Error:", err);
        });
    }
  };

  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* Go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* Middle */}

          {/* Last section */}
          <View className="flex-row items-center justify-center space-x-3">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      {/* Bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* Icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />

            {/* Text input */}
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-1 h-12 w-full"
              placeholder="Create a chat"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
            />
            {/* Icon */}
            {/* <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color={"#777"} />
            </TouchableOpacity> */}
          </View>
          <View className="w-full px-4 mt-5 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* Icons */}
            <Ionicons name="key" size={24} color={"#777"} />

            {/* Text input */}
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-1 h-12 w-full"
              placeholder="Create room password"
              placeholderTextColor={"#999"}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            {/* Icon */}
          </View>

          <View className="w-full px-4 mt-5 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* Icons */}
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={"#777"}
            />

            {/* Text input */}
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-1 h-12 w-full"
              placeholder="Create title"
              placeholderTextColor={"#999"}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            {/* Icon */}
          </View>
        </View>
        <View className="flex-1 items-center mt-5">
          <TouchableOpacity
            className="w-20 h-12 flex justify-center items-center rounded-xl bg-primary "
            onPress={createNewChat}
          >
            <Text className="text-white items-center">Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
