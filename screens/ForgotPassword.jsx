import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userAction";

const ForgotPassword = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = firebaseAuth;

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const handleForgot = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email); // Gửi email đặt lại mật khẩu
      Alert.alert("Password reset email sent. Please check your email.");
      navigation.navigate("LgoinScreen");
    } catch (error) {
      console.log(error);
      Alert.alert("Forgot password failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 items-center jstufy-start">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {/* Main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">
          Forgot Password ?
        </Text>

        <View className="w-full flex items-center justify-center">
          {/* Alert */}
          {alert && (
            <Text className="text-base text-red-600">{alertMessage}</Text>
          )}

          {/* Email */}
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          <TouchableOpacity onPress={handleForgot}>
            <Text className="text-base font-semibold mt-5 text-primaryBold">
              Forgot password ?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LgoinScreen")}>
            <Text className="text-base font-semibold mt-5 text-primaryBold">
              Return login?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
