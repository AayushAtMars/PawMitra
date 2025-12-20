import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

/**
 * FirstAidGuideScreen
 * Displays AI-generated first aid instructions with step-by-step guidance
 */
const FirstAidGuideScreen = ({ route, navigation }) => {
  const { incident } = route.params || {};
  const [completedSteps, setCompletedSteps] = useState([]);

  const firstAidSteps = incident?.aiAnalysis?.firstAidSteps || [
    'Approach the animal calmly and slowly',
    'Check for breathing and consciousness',
    'If bleeding, apply gentle pressure with clean cloth',
    'Keep the animal warm and comfortable',
    'Contact veterinary emergency services immediately',
  ];

  const severity = incident?.aiAnalysis?.severity || 'medium';
  const emergencyContacts = [
    { name: 'Emergency Vet', number: '1800-XXX-XXXX' },
    { name: 'Animal Rescue', number: '1800-XXX-YYYY' },
    { name: 'Local Shelter', number: '1800-XXX-ZZZZ' },
  ];

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `First Aid Instructions:\n\n${firstAidSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`,
        title: 'First Aid Guide',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      default:
        return theme.colors.success;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>First Aid Guide</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Severity Alert */}
        <View style={[styles.severityCard, { borderLeftColor: getSeverityColor() }]}>
          <Ionicons name="alert-circle" size={32} color={getSeverityColor()} />
          <View style={styles.severityInfo}>
            <Text style={styles.severityTitle}>Severity: {severity.toUpperCase()}</Text>
            <Text style={styles.severityText}>
              {severity === 'high' 
                ? 'Immediate veterinary attention required!'
                : severity === 'medium'
                ? 'Seek veterinary care as soon as possible'
                : 'Monitor the animal and consult a vet if needed'}
            </Text>
          </View>
        </View>

        {/* Safety Warning */}
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color={theme.colors.error} />
          <Text style={styles.warningText}>
            Always prioritize your safety. If the animal is aggressive or the situation is dangerous, 
            contact professional help immediately.
          </Text>
        </View>

        {/* First Aid Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          {firstAidSteps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stepCard}
              onPress={() => toggleStep(index)}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={[
                  styles.stepText,
                  completedSteps.includes(index) && styles.stepTextCompleted
                ]}>
                  {step}
                </Text>
                <TouchableOpacity onPress={() => toggleStep(index)}>
                  <Ionicons
                    name={completedSteps.includes(index) ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={completedSteps.includes(index) ? theme.colors.success : theme.colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Progress: {completedSteps.length} / {firstAidSteps.length} steps completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedSteps.length / firstAidSteps.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="call" size={20} color={theme.colors.white} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Important Tips</Text>
          <Text style={styles.tipText}>• Stay calm and speak softly to the animal</Text>
          <Text style={styles.tipText}>• Avoid sudden movements</Text>
          <Text style={styles.tipText}>• Keep other animals and people away</Text>
          <Text style={styles.tipText}>• Document the incident with photos if safe</Text>
          <Text style={styles.tipText}>• Note the time and location</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  severityCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  severityInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  severityTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  severityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  warningText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  stepCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  progressCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  contactNumber: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: theme.colors.accent + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
});

export default FirstAidGuideScreen;
