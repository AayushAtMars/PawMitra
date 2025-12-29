// UI-ONLY UPDATE: Enhanced styling for swipeable incident alert card
// Preserves all component API, logic, and props
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * Swipeable Incident Alert Card for Volunteers
 * Swipe right to accept, swipe left to decline
 */
const IncidentAlertCard = ({ incident, onAccept, onDecline, onView }) => {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          // Swipe right - Accept
          handleSwipeComplete('accept');
        } else if (gestureState.dx < -120) {
          // Swipe left - Decline
          handleSwipeComplete('decline');
        } else {
          // Return to center
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeComplete = (action) => {
    const toValue = action === 'accept' ? 500 : -500;
    
    Animated.parallel([
      Animated.timing(pan.x, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (action === 'accept') {
        onAccept?.(incident);
      } else {
        onDecline?.(incident);
      }
    });
  };

  const rotateCard = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const acceptOpacity = pan.x.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const declineOpacity = pan.x.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const getPriorityColor = () => {
    switch (incident.priority) {
      case 'high':
      case 'critical':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      default:
        return theme.colors.success;
    }
  };

  const calculateDistance = () => {
    // Mock distance calculation - replace with actual geolocation
    return '2.5 km';
  };

  return (
    <View style={styles.container}>
      {/* Swipe Indicators */}
      <Animated.View style={[styles.swipeIndicator, styles.acceptIndicator, { opacity: acceptOpacity }]}>
        <Ionicons name="checkmark-circle" size={72} color={theme.colors.success} />
        <Text style={[styles.swipeText, { color: theme.colors.success }]}>ACCEPT</Text>
      </Animated.View>

      <Animated.View style={[styles.swipeIndicator, styles.declineIndicator, { opacity: declineOpacity }]}>
        <Ionicons name="close-circle" size={72} color={theme.colors.error} />
        <Text style={[styles.swipeText, { color: theme.colors.error }]}>DECLINE</Text>
      </Animated.View>

      {/* Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }, { rotate: rotateCard }],
            opacity,
          },
        ]}
      >
        {/* Priority Badge */}
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.white} />
          <Text style={styles.priorityText}>
            {String(incident.priority || 'medium').toUpperCase()}
          </Text>
        </View>

        {/* Incident Photo */}
        {incident.photos && incident.photos.length > 0 ? (
          <Image source={{ uri: incident.photos[0].url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="paw" size={56} color={theme.colors.gray300} />
          </View>
        )}

        {/* Incident Details */}
        <View style={styles.details}>
          <Text style={styles.title}>
            {incident.animalType || 'Animal'} in distress
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={theme.colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {incident.address || 'Location not available'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={18} color={theme.colors.secondary} />
            <Text style={styles.infoText}>{calculateDistance()} away</Text>
          </View>

          {incident.aiAnalysis?.severity && (
            <View style={styles.infoRow}>
              <Ionicons name="medical" size={18} color={theme.colors.error} />
              <Text style={styles.infoText}>
                Severity: {incident.aiAnalysis.severity}
              </Text>
            </View>
          )}

          {incident.aiAnalysis?.firstAidSteps && incident.aiAnalysis.firstAidSteps.length > 0 && (
            <View style={styles.firstAidPreview}>
              <Text style={styles.firstAidTitle}>First Aid:</Text>
              <Text style={styles.firstAidText} numberOfLines={2}>
                {incident.aiAnalysis.firstAidSteps[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleSwipeComplete('decline')}
          >
            <Ionicons name="close" size={28} color={theme.colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => onView?.(incident)}
          >
            <Ionicons name="eye" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleSwipeComplete('accept')}
          >
            <Ionicons name="checkmark" size={28} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Swipe Hint */}
        <Text style={styles.swipeHint}>← Swipe to respond →</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 520,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  swipeIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  acceptIndicator: {
    right: 40,
  },
  declineIndicator: {
    left: 40,
  },
  swipeText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.extrabold,
    marginTop: theme.spacing.sm,
    letterSpacing: 1,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
    ...theme.shadows.xl,
    zIndex: 1,
  },
  priorityBadge: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: 6,
    zIndex: 2,
    ...theme.shadows.md,
  },
  priorityText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: theme.colors.gray100,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  firstAidPreview: {
    backgroundColor: theme.colors.accent + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  firstAidTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  firstAidText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  declineButton: {
    backgroundColor: theme.colors.error,
  },
  viewButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  acceptButton: {
    backgroundColor: theme.colors.success,
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    paddingBottom: theme.spacing.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default IncidentAlertCard;