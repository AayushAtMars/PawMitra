
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import theme from "../../theme";
import logo from "../../../assets/images/loginImage.png";
import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reanimated Floating Animation for Hero Image
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email.toLowerCase().trim(), password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


          {/* Hero Illustration */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.heroSection}
          >
            <Animated.Image
              // UPDATED: Using the local imported image
              source={logo}
              style={[styles.heroImage, floatingStyle]}
              resizeMode="contain"
            />
          </Animatable.View>

          {/* Main Text & Form Area */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={300}
            style={styles.contentSection}
          >
            <Text style={styles.headline}>Find Your Dream{"\n"}Pet Here</Text>
            <Text style={styles.subHeadline}>
              Join us & Discover the best & awesome{"\n"}pet in your location
            </Text>

            {/* Error Message */}
            {error
              ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )
              : null}

            {/* Inputs */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Main Action Button (Dark Pill) */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // The specific beige color from the image
    backgroundColor: "#FFF8F0",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoSquare: {
    width: 32,
    height: 32,
    backgroundColor: "#F4A26120", // Very light orange tint
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D2D2D",
    letterSpacing: -0.5,
  },
  // Hero
  heroSection: {
    height: height * 0.32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroImage: {
    width: width * 0.8,
    height: "100%",
  },

  // Content
  contentSection: {
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
  },
  headline: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#2D2D2D", // Dark charcoal
    marginBottom: 10,
    lineHeight: 36,
  },
  subHeadline: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },

  // Form
  formContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    // Unified shadow for web/mobile
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)'
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
    })
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 13,
    color: "#FFB74D", // Matching the orange accent
    fontWeight: "600",
  },

  // Login Button (The Dark Pill)
  loginButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#2D2D2D",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Unified shadow for web/mobile
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 4px 8px rgba(45, 45, 45, 0.2)'
    } : {
      shadowColor: "#2D2D2D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    })
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Footer
  footer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#F4A261", // Orange accent
    fontWeight: "bold",
    fontSize: 14,
  },

  // Error
  errorContainer: {
    width: "100%",
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
  },
});

export default LoginScreen;