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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import theme from '../../theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { signInWithGoogle, isLoading: googleLoading, isReady } = useGoogleAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const result = await signInWithGoogle();
      if (result?.success) {
        // Auth context will handle the login
        await login(null, null, result.token, result.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
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
        {/* Logo/Image Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/loginImage.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Find Your Dream{'\n'}Pet Here</Text>
          <Text style={styles.subtitle}>
            Join us & Discover the best & awesome pet in your location
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
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
              onPress={handleGoogleLogin}
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

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
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
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.md,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loginButton: {
    backgroundColor: theme.colors.textPrimary,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  registerLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.xs,
  },
});

export default LoginScreen;
