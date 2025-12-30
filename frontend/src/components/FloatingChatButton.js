// UI Component: Floating Action Button for AI Chatbot
import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const FloatingChatButton = ({ onPress, style }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Gentle pulse animation - slightly different timing/scale than report button to avoid syncing perfectly
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
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
                <Ionicons name="chatbubbles" size={28} color={theme.colors.white} />
                {/* <Ionicons name="mic" size={16} color={theme.colors.white} style={styles.micIcon} /> */}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: theme.spacing.lg,
        // Positioned above the report button (approx 64px + 16px spacing)
        bottom: Platform.OS === 'ios' ? theme.spacing.xxl + 80 : theme.spacing.xl + 80,
        zIndex: 999,
    },
    button: {
        width: 56, // Slightly smaller than report button
        height: 56,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.xl,
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    micIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    }
});

export default FloatingChatButton;
