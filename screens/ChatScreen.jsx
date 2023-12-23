import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { useSelector } from "react-redux";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const textInputRef = useRef(null);
  const [messages, setMessages] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [roomHash, setRoomHash] = useState();

  const handleKeyBoardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  const scrollViewRef = useRef();

  const handleMic = () => {};

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    setMessage("");

    try {
      await addDoc(
        collection(doc(firestoreDB, "chats", room._id), "messages"),
        _doc
      );
    } catch (err) {
      console.error("Error adding message to Firestore:", err);
    }
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unsubcribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubcribe;
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("result:", result);
      return result;
    }

    return null;
  };

  const handleCamera = async () => {
    try {
      const result = await pickImage();

      if (result && !result.cancelled) {
        console.log("Image URI:", result.assets[0].uri); // In giá trị đường dẫn ảnh đã chọn
        await sendImage(result.assets[0].uri);
      } else {
      }
    } catch (error) {}
  };

  const sendImage = async (url) => {
    if (url === null || url === undefined) {
      console.error("Invalid image URL");
      return;
    }

    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: "",
      user: user,
      image: url,
    };

    setMessage("");
    try {
      await addDoc(
        collection(doc(firestoreDB, "chats", room._id), "messages"),
        _doc
      );
    } catch (err) {
      console.error("Error adding message to Firestore:", err);
    }
  };

  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-6 flex-[0.2]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* Go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* Middle */}
          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
                {""}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                Online
              </Text>
            </View>
          </View>

          {/* Last section */}
          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
              keyboardShouldPersistTaps="handled"
            >
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                </>
              ) : (
                <>
                  {/* Message */}
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View className="m-1" key={i}>
                        <View
                          style={{ alignSelf: "flex-end" }}
                          className="px-4 py-4 rounded-tl-2xl rounded-tr-2xl bg-primary w-auto relative"
                        >
                          {msg.image ? (
                            // Hiển thị hình ảnh nếu tin nhắn có chứa hình ảnh
                            <Image
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10,
                              }}
                              source={{ uri: msg.image }}
                              resizeMode="cover"
                            />
                          ) : (
                            // Hiển thị nội dung văn bản nếu không có hình ảnh
                            <Text className="text-base font-semibold text-white">
                              {msg.message}
                            </Text>
                          )}
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        key={i}
                        style={{ alignSelf: "flex-start" }}
                        className="flex items-center justify-start space-x-2"
                      >
                        <View className="flex-row items-center justify-center space-x-2">
                          {/* Image */}
                          <Image
                            className="w-12 h-12 rounded-full"
                            resizeMode="cover"
                            source={{ uri: msg?.user?.profilePic }}
                          />

                          {/* Text */}
                          <View className="m-1">
                            <View className="px-4 py-4 rounded-tl-2xl rounded-tr-2xl bg-gray-200 w-auto relative">
                              {msg.image ? (
                                // Hiển thị hình ảnh nếu tin nhắn có chứa hình ảnh
                                <Image
                                  style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 10,
                                  }}
                                  source={{ uri: msg.image }}
                                  resizeMode="cover"
                                />
                              ) : (
                                // Hiển thị nội dung văn bản nếu không có hình ảnh
                                <Text className="text-base font-semibold text-black">
                                  {msg.message}
                                </Text>
                              )}
                            </View>
                            <View style={{ alignSelf: "flex-start" }}>
                              {msg.timeStamp?.seconds && (
                                <Text className="text-[12px] text-black font-semibold">
                                  {new Date(
                                    parseInt(msg?.timeStamp?.seconds) * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </>
              )}
            </ScrollView>
            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity>
                  <Entypo
                    name="camera"
                    onPress={handleCamera}
                    size={24}
                    color={"#555"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleKeyBoardOpen}>
                  <Entypo name="emoji-happy" size={24} color={"#555"} />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here ..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity onPress={handleMic}>
                  <Entypo name="mic" size={24} color={"#43C651"} />
                </TouchableOpacity>
                <TouchableOpacity className="pl-4" onPress={sendMessage}>
                  <FontAwesome name="send" size={24} color={"#555"} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
