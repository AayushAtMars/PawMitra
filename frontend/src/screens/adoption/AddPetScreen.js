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

      const response = await petsAPI.create(petData);
      
      // Show success alert
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Pet for Adoption</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Ionicons name="camera" size={32} color={theme.colors.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Pet Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.chip, formData.species === 'dog' && styles.chipActive]}
            onPress={() => setFormData({ ...formData, species: 'dog' })}
          >
            <Text style={[styles.chipText, formData.species === 'dog' && styles.chipTextActive]}>
              🐕 Dog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, formData.species === 'cat' && styles.chipActive]}
            onPress={() => setFormData({ ...formData, species: 'cat' })}
          >
            <Text style={[styles.chipText, formData.species === 'cat' && styles.chipTextActive]}>
              🐈 Cat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, formData.species === 'other' && styles.chipActive]}
            onPress={() => setFormData({ ...formData, species: 'other' })}
          >
            <Text style={[styles.chipText, formData.species === 'other' && styles.chipTextActive]}>
              🐾 Other
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={formData.breed}
          onChangeText={(text) => setFormData({ ...formData, breed: text })}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Age (e.g., 2 years)"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
          />
          <View style={[styles.input, styles.halfInput, styles.genderContainer]}>
            <TouchableOpacity
              style={[styles.genderButton, formData.gender === 'male' && styles.genderActive]}
              onPress={() => setFormData({ ...formData, gender: 'male' })}
            >
              <Ionicons name="male" size={20} color={formData.gender === 'male' ? theme.colors.white : theme.colors.gray600} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, formData.gender === 'female' && styles.genderActive]}
              onPress={() => setFormData({ ...formData, gender: 'female' })}
            >
              <Ionicons name="female" size={20} color={formData.gender === 'female' ? theme.colors.white : theme.colors.gray600} />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Health Status (e.g., Vaccinated, Healthy)"
          value={formData.healthStatus}
          onChangeText={(text) => setFormData({ ...formData, healthStatus: text })}
        />
      </View>

      {/* Lost & Found Toggle */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setFormData({ ...formData, isLostFound: !formData.isLostFound })}
        >
          <View>
            <Text style={styles.toggleTitle}>Mark as Lost/Found</Text>
            <Text style={styles.toggleSubtitle}>This is a lost or found pet</Text>
          </View>
          <View style={[styles.toggle, formData.isLostFound && styles.toggleActive]}>
            <View style={[styles.toggleThumb, formData.isLostFound && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        {formData.isLostFound && (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.chip, formData.lostFoundType === 'lost' && styles.chipActive]}
              onPress={() => setFormData({ ...formData, lostFoundType: 'lost' })}
            >
              <Text style={[styles.chipText, formData.lostFoundType === 'lost' && styles.chipTextActive]}>
                Lost
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, formData.lostFoundType === 'found' && styles.chipActive]}
              onPress={() => setFormData({ ...formData, lostFoundType: 'found' })}
            >
              <Text style={[styles.chipText, formData.lostFoundType === 'found' && styles.chipTextActive]}>
                Found
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray600,
    marginTop: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    fontSize: theme.typography.fontSize.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.white,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.gray600,
    fontWeight: theme.typography.fontWeight.medium,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  genderButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  genderActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  toggleTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray300,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default AddPetScreen;
