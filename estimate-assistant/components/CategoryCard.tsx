import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CategoryCardProps {
  title: string;
  isComingSoon?: boolean;
  onPress: () => void;
  icon?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  isComingSoon = false,
  onPress,
  icon = '📐',
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isComingSoon && styles.cardDisabled]}
      onPress={onPress}
      disabled={isComingSoon}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {isComingSoon && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#4A90E2',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#cccccc',
    opacity: 0.6,
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
