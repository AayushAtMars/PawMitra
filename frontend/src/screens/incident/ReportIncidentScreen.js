import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { incidentsAPI } from '../../services/api';
import { getCurrentLocation, reverseGeocode } from '../../utils/geolocation';
import theme from '../../theme';

const ReportIncidentScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    requestPermissions();
    getLocation();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await CameraView.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  const getLocation = async () => {
    const result = await getCurrentLocation();
    if (result.success) {
      setLocation(result.location);
      
      // Get address
      const addressResult = await reverseGeocode(
        result.location.latitude,
        result.location.longitude
      );
      if (addressResult.success) {
        setAddress(addressResult.address);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      setPhoto(photo);
      setShowCamera(false);
      // Don't auto-submit, let user review first
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      // Don't auto-submit, let user review first
    }
  };

  const submitReport = async () => {
    if (!photo || !location) {
      Alert.alert('Error', 'Photo and location are required');
      return;
    }

    setAnalyzing(true);
    setAiResult(null);

    try {
      const response = await incidentsAPI.create({
        location: {
          type: 'Point',
          coordinates: location.coordinates,
        },
        address: address || 'Location not available',
        imageBase64: `data:image/jpeg;base64,${photo.base64}`,
        description: 'Reported via mobile app',
      });

      if (response.data.success) {
        setAiResult(response.data.incident.aiAnalysis);
        Alert.alert(
          'Incident Reported Successfully',
          `Case ID: ${response.data.incident._id}\nPriority: ${response.data.incident.aiAnalysis.priority.toUpperCase()}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setPhoto(null);
                setAiResult(null);
                navigation.navigate('Home');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error reporting incident:', error);
      Alert.alert('Error', 'Failed to report incident. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const retake = () => {
    setPhoto(null);
    setAiResult(null);
    setShowCamera(true);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color={theme.colors.gray400} />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={32} color={theme.colors.white} />
            </TouchableOpacity>

            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="camera" size={48} color={theme.colors.primary} />
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>Help an animal in need</Text>
      </View>

      {/* Location Info */}
      {location && (
        <View style={styles.locationCard}>
          <Ionicons name="location" size={24} color={theme.colors.primary} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.locationAddress}>{address || 'Getting address...'}</Text>
          </View>
        </View>
      )}

      {/* Photo Preview */}
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          
          {analyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.white} />
              <Text style={styles.analyzingText}>Analyzing with AI...</Text>
            </View>
          )}

          {aiResult && !analyzing && (
            <View style={styles.aiResultCard}>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(aiResult.priority) }
              ]}>
                <Text style={styles.priorityText}>
                  {aiResult.priority.toUpperCase()} PRIORITY
                </Text>
              </View>

              <Text style={styles.aiCategory}>
                Category: {aiResult.category.replace('_', ' ').toUpperCase()}
              </Text>

              <Text style={styles.aiDescription}>{aiResult.description}</Text>

              {aiResult.firstAidInstructions && aiResult.firstAidInstructions.length > 0 && (
                <View style={styles.firstAidSection}>
                  <Text style={styles.firstAidTitle}>🩹 First Aid Instructions:</Text>
                  {aiResult.firstAidInstructions.map((instruction, index) => (
                    <Text key={index} style={styles.firstAidItem}>
                      {index + 1}. {instruction}
                    </Text>
                  ))}
                </View>
              )}

              {aiResult.safetyWarnings && aiResult.safetyWarnings.length > 0 && (
                <View style={styles.warningSection}>
                  <Text style={styles.warningTitle}>⚠️ Safety Warnings:</Text>
                  {aiResult.safetyWarnings.map((warning, index) => (
                    <Text key={index} style={styles.warningItem}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={submitReport}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={theme.colors.white} />
                <Text style={styles.submitText}>Submit Report</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.retakeButton} onPress={retake}>
            <Ionicons name="refresh" size={20} color={theme.colors.gray600} />
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowCamera(true)}
          >
            <Ionicons name="camera" size={32} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Ionicons name="images" size={32} color={theme.colors.secondary} />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📸 How to Report:</Text>
        <Text style={styles.instructionItem}>1. Take a clear photo of the animal</Text>
        <Text style={styles.instructionItem}>2. AI will analyze the situation</Text>
        <Text style={styles.instructionItem}>3. Follow first aid instructions if safe</Text>
        <Text style={styles.instructionItem}>4. Nearby volunteers will be alerted</Text>
      </View>
    </ScrollView>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return theme.colors.priorityHigh;
    case 'medium':
      return theme.colors.priorityMedium;
    case 'low':
      return theme.colors.priorityLow;
    default:
      return theme.colors.gray500;
  }
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
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  locationInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  locationTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  locationAddress: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  photoContainer: {
    marginBottom: theme.spacing.xl,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.gray200,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    marginTop: theme.spacing.md,
  },
  aiResultCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  },
  priorityText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  aiCategory: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  aiDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  firstAidSection: {
    backgroundColor: theme.colors.accent + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  firstAidTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  firstAidItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  warningSection: {
    backgroundColor: theme.colors.warning + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  warningTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
  },
  warningItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  retakeText: {
    color: theme.colors.gray600,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.sm,
  },
  instructionsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  instructionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xxl,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
  },
  permissionText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default ReportIncidentScreen;
