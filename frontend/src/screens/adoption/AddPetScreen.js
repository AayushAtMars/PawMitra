// // UI-ONLY UPDATE: Enhanced styling for Add Pet screen with better visual hierarchy
// // Preserves all existing business logic, API calls, and handlers
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { petsAPI } from '../../services/api';
// import { getCurrentLocation } from '../../utils/geolocation';
// import theme from '../../theme';

// const AddPetScreen = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     species: 'dog',
//     breed: '',
//     age: '',
//     gender: 'male',
//     description: '',
//     healthStatus: '',
//     isLostFound: false,
//     lostFoundType: 'lost',
//   });
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: 'images',
//       allowsMultipleSelection: true,
//       quality: 0.8,
//       base64: true,
//     });

//     if (!result.canceled) {
//       setPhotos([...photos, ...result.assets]);
//     }
//   };

//   const removePhoto = (index) => {
//     setPhotos(photos.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.species) {
//       Alert.alert('Error', 'Please fill in required fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const location = await getCurrentLocation();

//       const petData = {
//         ...formData,
//         location: location.success ? location.location : null,
//         photos: photos.map(photo => ({
//           url: `data:image/jpeg;base64,${photo.base64}`,
//         })),
//       };

//       const response = await petsAPI.create(petData);

//       Alert.alert('✅ Success', 'Pet added locally to "My Pets"!', [
//         { text: 'OK', onPress: () => navigation.goBack() }
//       ]);
//     } catch (error) {
//       console.error('Error adding pet:', error);
//       Alert.alert('Error', 'Failed to add pet. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => {
//             if (formData.name || formData.breed || photos.length > 0) {
//               Alert.alert(
//                 'Discard Changes?',
//                 'You have unsaved changes. Are you sure you want to go back?',
//                 [
//                   { text: 'Cancel', style: 'cancel' },
//                   { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
//                 ]
//               );
//             } else {
//               navigation.goBack();
//             }
//           }}>
//             <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
//           </TouchableOpacity>
//           <Text style={styles.title}>Add Pet for Adoption</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Progress Indicator */}
//         <View style={styles.progressBar}>
//           <View style={[styles.progressFill, { width: '33%' }]} />
//         </View>

//         {/* Photos Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="camera" size={24} color={theme.colors.primary} />
//             <Text style={styles.sectionTitle}>Photos *</Text>
//           </View>
//           <Text style={styles.sectionSubtitle}>Add at least one photo of your pet</Text>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.photosContainer}
//           >
//             {photos.map((photo, index) => (
//               <View key={index} style={styles.photoWrapper}>
//                 <Image source={{ uri: photo.uri }} style={styles.photo} />
//                 <TouchableOpacity
//                   style={styles.removePhotoButton}
//                   onPress={() => removePhoto(index)}
//                 >
//                   <Ionicons name="close-circle" size={28} color={theme.colors.error} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//             <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
//               <Ionicons name="add-circle" size={40} color={theme.colors.primary} />
//               <Text style={styles.addPhotoText}>Add Photo</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>

//         {/* Basic Information */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="information-circle" size={24} color={theme.colors.secondary} />
//             <Text style={styles.sectionTitle}>Basic Information</Text>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Pet Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Buddy, Luna"
//               value={formData.name}
//               onChangeText={(text) => setFormData({ ...formData, name: text })}
//               placeholderTextColor={theme.colors.gray400}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Species *</Text>
//             <View style={styles.chipRow}>
//               {[
//                 { label: '🐕 Dog', value: 'dog' },
//                 { label: '🐈 Cat', value: 'cat' },
//                 { label: '🐾 Other', value: 'other' },
//               ].map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   style={[
//                     styles.chip,
//                     formData.species === option.value && styles.chipActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, species: option.value })}
//                 >
//                   <Text
//                     style={[
//                       styles.chipText,
//                       formData.species === option.value && styles.chipTextActive,
//                     ]}
//                   >
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Breed</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Golden Retriever, Persian"
//               value={formData.breed}
//               onChangeText={(text) => setFormData({ ...formData, breed: text })}
//               placeholderTextColor={theme.colors.gray400}
//             />
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.md }]}>
//               <Text style={styles.inputLabel}>Age</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g., 2 years"
//                 value={formData.age}
//                 onChangeText={(text) => setFormData({ ...formData, age: text })}
//                 placeholderTextColor={theme.colors.gray400}
//               />
//             </View>

//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.inputLabel}>Gender</Text>
//               <View style={styles.genderButtons}>
//                 <TouchableOpacity
//                   style={[
//                     styles.genderButton,
//                     formData.gender === 'male' && styles.genderButtonActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, gender: 'male' })}
//                 >
//                   <Ionicons
//                     name="male"
//                     size={24}
//                     color={formData.gender === 'male' ? theme.colors.white : theme.colors.gray600}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.genderButton,
//                     formData.gender === 'female' && styles.genderButtonActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, gender: 'female' })}
//                 >
//                   <Ionicons
//                     name="female"
//                     size={24}
//                     color={formData.gender === 'female' ? theme.colors.white : theme.colors.gray600}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Description</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Tell us about your pet's personality, habits, etc."
//               value={formData.description}
//               onChangeText={(text) => setFormData({ ...formData, description: text })}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor={theme.colors.gray400}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Health Status</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Vaccinated, Neutered, Healthy"
//               value={formData.healthStatus}
//               onChangeText={(text) => setFormData({ ...formData, healthStatus: text })}
//               placeholderTextColor={theme.colors.gray400}
//             />
//           </View>
//         </View>

//         {/* Lost & Found Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="search" size={24} color={theme.colors.accent} />
//             <Text style={styles.sectionTitle}>Lost & Found</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.toggleCard}
//             onPress={() => setFormData({ ...formData, isLostFound: !formData.isLostFound })}
//           >
//             <View style={styles.toggleInfo}>
//               <Text style={styles.toggleTitle}>Mark as Lost/Found</Text>
//               <Text style={styles.toggleSubtitle}>This is a lost or found pet</Text>
//             </View>
//             <View style={[styles.toggle, formData.isLostFound && styles.toggleActive]}>
//               <View style={[styles.toggleThumb, formData.isLostFound && styles.toggleThumbActive]} />
//             </View>
//           </TouchableOpacity>

//           {formData.isLostFound && (
//             <View style={styles.chipRow}>
//               {[
//                 { label: 'Lost', value: 'lost', icon: 'alert-circle' },
//                 { label: 'Found', value: 'found', icon: 'checkmark-circle' },
//               ].map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   style={[
//                     styles.chip,
//                     formData.lostFoundType === option.value && styles.chipActive,
//                   ]}
//                   onPress={() => setFormData({ ...formData, lostFoundType: option.value })}
//                 >
//                   <Ionicons
//                     name={option.icon}
//                     size={18}
//                     color={
//                       formData.lostFoundType === option.value
//                         ? theme.colors.white
//                         : theme.colors.gray600
//                     }
//                   />
//                   <Text
//                     style={[
//                       styles.chipText,
//                       formData.lostFoundType === option.value && styles.chipTextActive,
//                     ]}
//                   >
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Spacer */}
//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Submit Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color={theme.colors.white} />
//           ) : (
//             <>
//               <Ionicons name="checkmark-circle" size={24} color={theme.colors.white} />
//               <Text style={styles.submitText}>Add Pet</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: theme.spacing.xxxl,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: theme.spacing.lg,
//     backgroundColor: theme.colors.white,
//   },
//   title: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: theme.colors.gray200,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: theme.colors.primary,
//   },
//   section: {
//     padding: theme.spacing.lg,
//     marginBottom: theme.spacing.md,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.xs,
//   },
//   sectionTitle: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   sectionSubtitle: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.lg,
//   },
//   photosContainer: {
//     gap: theme.spacing.md,
//   },
//   photoWrapper: {
//     position: 'relative',
//   },
//   photo: {
//     width: 120,
//     height: 120,
//     borderRadius: theme.borderRadius.lg,
//   },
//   removePhotoButton: {
//     position: 'absolute',
//     top: -10,
//     right: -10,
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.full,
//   },
//   addPhotoButton: {
//     width: 120,
//     height: 120,
//     borderRadius: theme.borderRadius.lg,
//     borderWidth: 2,
//     borderColor: theme.colors.primary,
//     borderStyle: 'dashed',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.primary + '10',
//   },
//   addPhotoText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.primary,
//     fontWeight: theme.typography.fontWeight.semibold,
//     marginTop: theme.spacing.xs,
//   },
//   inputGroup: {
//     marginBottom: theme.spacing.lg,
//   },
//   inputLabel: {
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.sm,
//   },
//   input: {
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.lg,
//     padding: theme.spacing.lg,
//     borderWidth: 1,
//     borderColor: theme.colors.gray200,
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textPrimary,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   chipRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: theme.spacing.sm,
//   },
//   chip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.borderRadius.full,
//     borderWidth: 1,
//     borderColor: theme.colors.gray300,
//     backgroundColor: theme.colors.white,
//     gap: theme.spacing.sm,
//   },
//   chipActive: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   chipText: {
//     color: theme.colors.gray600,
//     fontWeight: theme.typography.fontWeight.semibold,
//     fontSize: theme.typography.fontSize.md,
//   },
//   chipTextActive: {
//     color: theme.colors.white,
//   },
//   genderButtons: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//   },
//   genderButton: {
//     flex: 1,
//     padding: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     backgroundColor: theme.colors.white,
//     borderWidth: 1,
//     borderColor: theme.colors.gray200,
//     alignItems: 'center',
//   },
//   genderButtonActive: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   toggleCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: theme.colors.white,
//     padding: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     marginBottom: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.gray200,
//   },
//   toggleInfo: {
//     flex: 1,
//   },
//   toggleTitle: {
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.textPrimary,
//   },
//   toggleSubtitle: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   toggle: {
//     width: 56,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: theme.colors.gray300,
//     padding: 3,
//   },
//   toggleActive: {
//     backgroundColor: theme.colors.primary,
//   },
//   toggleThumb: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: theme.colors.white,
//   },
//   toggleThumbActive: {
//     transform: [{ translateX: 24 }],
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: theme.spacing.lg,
//     backgroundColor: theme.colors.white,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.gray200,
//     ...theme.shadows.lg,
//   },
//   submitButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: theme.colors.secondary,
//     borderRadius: theme.borderRadius.lg,
//     padding: theme.spacing.lg,
//     gap: theme.spacing.sm,
//   },
//   submitText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.bold,
//   },
// });

// export default AddPetScreen;




import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { petsAPI } from '../../services/api';
import { getCurrentLocation } from '../../utils/geolocation';
import theme from '../../theme';

const AddPetScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    description: '',
    healthStatus: '',
    isLostFound: false,
    lostFoundType: 'lost',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.species) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentLocation();

      const petData = {
        ...formData,
        location: location.success ? location.location : null,
        photos: photos.map(photo => ({
          url: `data:image/jpeg;base64,${photo.base64}`,
        })),
      };

      await petsAPI.create(petData);

      Alert.alert('Success', 'Pet added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (formData.name || formData.breed || photos.length > 0) {
              Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Pet for Adoption</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Photos *</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Add at least one photo of your pet</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosContainer}
          >
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removePhoto(index)}
                >
                  <Ionicons name="close-circle" size={28} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
              <Ionicons name="add-circle" size={40} color={theme.colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Buddy, Luna"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor={theme.colors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Species *</Text>
            <View style={styles.chipRow}>
              {[
                { label: '🐕 Dog', value: 'dog' },
                { label: '🐈 Cat', value: 'cat' },
                { label: '🐾 Other', value: 'other' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    formData.species === option.value && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, species: option.value })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.species === option.value && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Golden Retriever, Persian"
              value={formData.breed}
              onChangeText={(text) => setFormData({ ...formData, breed: text })}
              placeholderTextColor={theme.colors.gray400}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.md }]}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2 years"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholderTextColor={theme.colors.gray400}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'male' })}
                >
                  <Ionicons
                    name="male"
                    size={24}
                    color={formData.gender === 'male' ? theme.colors.white : theme.colors.gray600}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'female' })}
                >
                  <Ionicons
                    name="female"
                    size={24}
                    color={formData.gender === 'female' ? theme.colors.white : theme.colors.gray600}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your pet's personality, habits, etc."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Health Status</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Vaccinated, Neutered, Healthy"
              value={formData.healthStatus}
              onChangeText={(text) => setFormData({ ...formData, healthStatus: text })}
              placeholderTextColor={theme.colors.gray400}
            />
          </View>
        </View>

        {/* Lost & Found Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={24} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>Lost & Found</Text>
          </View>

          <TouchableOpacity
            style={styles.toggleCard}
            onPress={() => setFormData({ ...formData, isLostFound: !formData.isLostFound })}
          >
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Mark as Lost/Found</Text>
              <Text style={styles.toggleSubtitle}>This is a lost or found pet</Text>
            </View>
            <View style={[styles.toggle, formData.isLostFound && styles.toggleActive]}>
              <View style={[styles.toggleThumb, formData.isLostFound && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>

          {formData.isLostFound && (
            <View style={styles.chipRow}>
              {[
                { label: 'Lost', value: 'lost', icon: 'alert-circle' },
                { label: 'Found', value: 'found', icon: 'checkmark-circle' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    formData.lostFoundType === option.value && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, lostFoundType: option.value })}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={
                      formData.lostFoundType === option.value
                        ? theme.colors.white
                        : theme.colors.gray600
                    }
                  />
                  <Text
                    style={[
                      styles.chipText,
                      formData.lostFoundType === option.value && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Spacer for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.white} />
              <Text style={styles.submitText}>Add Pet</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.gray200,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  section: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  photosContainer: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.lg,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
  },
  addPhotoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.xs,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.white,
    gap: theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.gray600,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.md,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray300,
    padding: 3,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.white,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    ...theme.shadows.lg,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default AddPetScreen;



