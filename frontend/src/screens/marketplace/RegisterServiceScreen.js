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
import { marketplaceAPI } from '../../services/api';
import { getCurrentLocation } from '../../utils/geolocation';
import theme from '../../theme';

const RegisterServiceScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'pet_shop',
    description: '',
    contactInfo: {
      phone: '',
      email: '',
      website: '',
    },
    address: '',
    emergencyAvailable: false,
    emergency24x7: false,
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'pet_shop', name: 'Pet Shop', icon: 'storefront' },
    { id: 'veterinary', name: 'Veterinary', icon: 'medical' },
    { id: 'grooming', name: 'Grooming', icon: 'cut' },
    { id: 'training', name: 'Training', icon: 'school' },
    { id: 'boarding', name: 'Boarding', icon: 'home' },
  ];

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setLogo(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.contactInfo.phone) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentLocation();
      
      const serviceData = {
        ...formData,
        location: location.success ? location.location : null,
        logo: logo ? {
          url: `data:image/jpeg;base64,${logo.base64}`,
        } : null,
      };

      const response = await marketplaceAPI.registerService(serviceData);
      
      // Show success alert regardless of response structure
      Alert.alert('Success', 'Service registered successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error registering service:', error);
      Alert.alert('Error', 'Failed to register service. Please try again.');
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
        <Text style={styles.title}>Register Your Service</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Logo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Logo</Text>
        <TouchableOpacity style={styles.logoContainer} onPress={pickLogo}>
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Ionicons name="camera" size={32} color={theme.colors.gray400} />
              <Text style={styles.logoText}>Add Logo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category *</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                formData.category === cat.id && styles.categoryCardActive
              ]}
              onPress={() => setFormData({ ...formData, category: cat.id })}
            >
              <Ionicons
                name={cat.icon}
                size={24}
                color={formData.category === cat.id ? theme.colors.white : theme.colors.primary}
              />
              <Text style={[
                styles.categoryText,
                formData.category === cat.id && styles.categoryTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Business Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Business Name *"
          value={formData.businessName}
          onChangeText={(text) => setFormData({ ...formData, businessName: text })}
        />

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
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={formData.contactInfo.phone}
          onChangeText={(text) => setFormData({
            ...formData,
            contactInfo: { ...formData.contactInfo, phone: text }
          })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.contactInfo.email}
          onChangeText={(text) => setFormData({
            ...formData,
            contactInfo: { ...formData.contactInfo, email: text }
          })}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Website (optional)"
          value={formData.contactInfo.website}
          onChangeText={(text) => setFormData({
            ...formData,
            contactInfo: { ...formData.contactInfo, website: text }
          })}
        />
      </View>

      {/* Emergency Services */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setFormData({
            ...formData,
            emergencyAvailable: !formData.emergencyAvailable
          })}
        >
          <View>
            <Text style={styles.toggleTitle}>Emergency Services Available</Text>
            <Text style={styles.toggleSubtitle}>We provide emergency services</Text>
          </View>
          <View style={[styles.toggle, formData.emergencyAvailable && styles.toggleActive]}>
            <View style={[styles.toggleThumb, formData.emergencyAvailable && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        {formData.emergencyAvailable && (
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setFormData({
              ...formData,
              emergency24x7: !formData.emergency24x7
            })}
          >
            <View>
              <Text style={styles.toggleTitle}>24/7 Emergency</Text>
              <Text style={styles.toggleSubtitle}>Available round the clock</Text>
            </View>
            <View style={[styles.toggle, formData.emergency24x7 && styles.toggleActive]}>
              <View style={[styles.toggleThumb, formData.emergency24x7 && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>
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
            <Text style={styles.submitText}>Register Service</Text>
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
  logoContainer: {
    alignSelf: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    marginTop: theme.spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.gray200,
  },
  categoryCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  categoryTextActive: {
    color: theme.colors.white,
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

export default RegisterServiceScreen;
