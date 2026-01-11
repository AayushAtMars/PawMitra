import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import theme from '../../theme';

const RegisterScreen = ({ navigation }) => {
  const { register, login } = useAuth();
  const { signInWithGoogle, isLoading: googleLoading, isReady } = useGoogleAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await register({
        name,
        email,
        password,
        phone,
        role: isVolunteer ? 'volunteer' : 'citizen',
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setError('');
      const result = await signInWithGoogle();
      if (result?.success) {
        await login(null, null, result.token, result.user);
      }
    } catch (err) {
      console.error('Google register error:', err);
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join PawMitra to help animals in need
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.gray400}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.gray400}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              placeholderTextColor={theme.colors.gray400}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.gray400}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color={theme.colors.gray400} 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray400} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={theme.colors.gray400}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Volunteer Toggle */}
          <View style={styles.volunteerContainer}>
            <View style={styles.volunteerInfo}>
              <Ionicons name="heart" size={24} color={theme.colors.primary} />
              <View style={styles.volunteerTextContainer}>
                <Text style={styles.volunteerTitle}>Register as Volunteer</Text>
                <Text style={styles.volunteerSubtitle}>Help animals in distress</Text>
              </View>
            </View>
            <Switch
              value={isVolunteer}
              onValueChange={setIsVolunteer}
              trackColor={{ false: theme.colors.gray300, true: theme.colors.primary + '80' }}
              thumbColor={isVolunteer ? theme.colors.primary : theme.colors.gray100}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, googleLoading && styles.disabledButton]}
              onPress={handleGoogleRegister}
              disabled={googleLoading || !isReady}
            >
              {googleLoading ? (
                <ActivityIndicator color={theme.colors.primary} size="small" />
              ) : (
                <>
                  <Image 
                    source={{ uri: 'https://www.google.com/favicon.ico' }}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  volunteerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  volunteerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  volunteerTextContainer: {
    marginLeft: theme.spacing.sm,
  },
  volunteerTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  volunteerSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray200,
  },
  dividerText: {
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minWidth: 150,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.sm,
  },
  socialButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.xs,
  },
});

export default RegisterScreen;
