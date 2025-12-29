// UI Component: Floating Action Button for quick incident reporting
import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const FloatingReportButton = ({ onPress, style }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={28} color={theme.colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: Platform.OS === 'ios' ? theme.spacing.xxl : theme.spacing.xl,
    zIndex: 999,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.xl,
  },
});

export default FloatingReportButton;