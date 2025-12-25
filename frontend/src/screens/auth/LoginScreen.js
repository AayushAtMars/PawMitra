// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../context/AuthContext';
// import theme from '../../theme';

// const LoginScreen = ({ navigation }) => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     const result = await login(email.toLowerCase().trim(), password);

//     if (!result.success) {
//       setError(result.error);
//     }

//     setLoading(false);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar style="light" />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.logo}>🐾</Text>
//           <Text style={styles.title}>PawMitra</Text>
//           <Text style={styles.subtitle}>Animal Welfare Network</Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           <Text style={styles.formTitle}>Welcome Back</Text>

//           {error ? (
//             <View style={styles.errorContainer}>
//               <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : null}

//           {/* Email Input */}
//           <View style={styles.inputContainer}>
//             <Ionicons name="mail-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor={theme.colors.gray400}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           {/* Password Input */}
//           <View style={styles.inputContainer}>
//             <Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor={theme.colors.gray400}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Ionicons
//                 name={showPassword ? 'eye-outline' : 'eye-off-outline'}
//                 size={20}
//                 color={theme.colors.gray400}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={theme.colors.white} />
//             ) : (
//               <Text style={styles.buttonText}>Login</Text>
//             )}
//           </TouchableOpacity>

//           {/* Register Link */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//               <Text style={styles.link}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.primary,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: theme.spacing.lg,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: theme.spacing.xxl,
//   },
//   logo: {
//     fontSize: 64,
//     marginBottom: theme.spacing.md,
//   },
//   title: {
//     fontSize: theme.typography.fontSize.xxxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.white,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.primaryLight,
//   },
//   form: {
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.xxl,
//     padding: theme.spacing.xl,
//     ...theme.shadows.lg,
//   },
//   formTitle: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.lg,
//     textAlign: 'center',
//   },
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.error + '20',
//     padding: theme.spacing.md,
//     borderRadius: theme.borderRadius.md,
//     marginBottom: theme.spacing.md,
//   },
//   errorText: {
//     color: theme.colors.error,
//     marginLeft: theme.spacing.sm,
//     flex: 1,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.gray50,
//     borderRadius: theme.borderRadius.lg,
//     paddingHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.gray200,
//   },
//   inputIcon: {
//     marginRight: theme.spacing.sm,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: theme.spacing.md,
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textPrimary,
//   },
//   button: {
//     backgroundColor: theme.colors.primary,
//     borderRadius: theme.borderRadius.lg,
//     paddingVertical: theme.spacing.md,
//     alignItems: 'center',
//     marginTop: theme.spacing.md,
//     ...theme.shadows.md,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: theme.spacing.lg,
//   },
//   footerText: {
//     color: theme.colors.textSecondary,
//     fontSize: theme.typography.fontSize.md,
//   },
//   link: {
//     color: theme.colors.primary,
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
// });

// export default LoginScreen;


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

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          {/* Top Logo Icon (Orange Box) */}
          <View style={styles.topIconContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="paw" size={24} color="#8B5E3C" />
            </View>
          </View>

          {/* Hero Illustration */}
          <View style={styles.heroSection}>
            <Image
              // UPDATED: Using the local imported image
              source={logo}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* Main Text & Form Area */}
          <View style={styles.contentSection}>
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
          </View>
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
    paddingVertical: 20,
  },

  // Top Icon
  topIconContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: "#FFDCA2", // The light orange square color
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero
  heroSection: {
    height: height * 0.35,
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
    borderRadius: 16, // Rounded corners for inputs
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#EFEFEF", // Very subtle border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: "#2D2D2D", // The dark button color
    borderRadius: 30, // Fully rounded pill shape
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2D2D2D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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