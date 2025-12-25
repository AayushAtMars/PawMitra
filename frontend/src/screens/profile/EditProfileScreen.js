// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import {
//   Alert,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import theme from "../../theme"; // Assuming path

// const EditProfileScreen = ({ navigation }) => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     bio: user?.bio || "",
//   });

//   const handleSave = () => {
//     // API Call to update profile would go here
//     Alert.alert("Success", "Profile updated successfully");
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Edit Profile</Text>
//         <TouchableOpacity onPress={handleSave}>
//           <Text style={styles.saveText}>Save</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Avatar Section */}
//         <View style={styles.avatarSection}>
//           <View style={styles.avatarContainer}>
//             {user?.avatar
//               ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
//               : (
//                 <View style={[styles.avatar, styles.avatarPlaceholder]}>
//                   <Ionicons name="person" size={48} color={theme.colors.gray400} />
//                 </View>
//               )}
//             <TouchableOpacity style={styles.cameraButton}>
//               <Ionicons name="camera" size={20} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.changePhotoText}>Change Profile Photo</Text>
//         </View>

//         {/* Form Fields */}
//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Full Name</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.name}
//             onChangeText={(t) => setFormData({ ...formData, name: t })}
//           />
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={[styles.input, styles.disabledInput]}
//             value={formData.email}
//             editable={false}
//           />
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.phone}
//             onChangeText={(t) => setFormData({ ...formData, phone: t })}
//             keyboardType="phone-pad"
//           />
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Bio</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             value={formData.bio}
//             onChangeText={(t) => setFormData({ ...formData, bio: t })}
//             multiline
//             numberOfLines={4}
//             placeholder="Tell us about yourself..."
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#FFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.textPrimary },
//   saveText: { fontSize: 16, fontWeight: "600", color: theme.colors.primary },
//   content: { padding: 20 },
//   avatarSection: { alignItems: "center", marginBottom: 32 },
//   avatarContainer: { position: "relative" },
//   avatar: { width: 100, height: 100, borderRadius: 50 },
//   avatarPlaceholder: { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
//   cameraButton: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: theme.colors.primary,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   changePhotoText: { marginTop: 12, color: theme.colors.primary, fontWeight: "600" },
//   formGroup: { marginBottom: 20 },
//   label: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: "500" },
//   input: {
//     backgroundColor: "#FFF",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     color: theme.colors.textPrimary,
//   },
//   disabledInput: { backgroundColor: "#F9FAFB", color: "#9CA3AF" },
//   textArea: { height: 100, textAlignVertical: "top" },
// });

// export default EditProfileScreen;

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { authAPI } from "../../services/api";
import theme from "../../theme";

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // 1. Pick Image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery to change your photo.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, // Reduce quality slightly to ensure reliable upload
    });

    if (!result.canceled) {
      // Save the URI locally to show preview
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 2. Save Logic
  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Required", "Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);

      // Append Image if selected
      if (selectedImage) {
        // Get filename
        const filename = selectedImage.split("/").pop();

        // Infer type from extension
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        data.append("avatar", {
          uri: selectedImage, // Keep 'file://' for Android/iOS consistency in most cases
          name: filename,
          type: type,
        });
      }

      console.log("Sending Profile Update...");

      // Call API
      const response = await authAPI.updateProfile(data);
      console.log("Update Success:", response.data);

      // Update Context
      if (updateUser && response.data.user) {
        updateUser(response.data.user);
      } else {
        // Fallback if backend doesn't return user object immediately
        updateUser({
          ...user,
          ...formData,
          avatar: selectedImage || user.avatar,
        });
      }

      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update Failed:", error);
      const msg = error.response?.data?.error || error.message || "Check your internet connection.";
      Alert.alert("Update Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        {loading
          ? <ActivityIndicator size="small" color={theme.colors.primary} />
          : (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {selectedImage
              ? <Image source={{ uri: selectedImage }} style={styles.avatar} />
              : user?.avatar
              ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
              : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={48} color={theme.colors.gray400} />
                </View>
              )}

            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(t) => setFormData({ ...formData, name: t })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.email}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(t) => setFormData({ ...formData, phone: t })}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(t) => setFormData({ ...formData, bio: t })}
            multiline
            numberOfLines={4}
            editable={!loading}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background || "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.textPrimary },
  saveText: { fontSize: 16, fontWeight: "600", color: theme.colors.primary },
  content: { padding: 20 },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  changePhotoText: { marginTop: 12, color: theme.colors.primary, fontWeight: "600" },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  disabledInput: { backgroundColor: "#F9FAFB", color: "#9CA3AF" },
  textArea: { height: 100 },
});

export default EditProfileScreen;