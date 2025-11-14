import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryCard } from '../components/CategoryCard';

type RootStackParamList = {
  Home: undefined;
  WallCovering: undefined;
  ComingSoon: { category: string };
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Material Estimate Assistant</Text>
          <Text style={styles.subtitle}>Select a calculator to get started</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <CategoryCard
            title="Wall Covering"
            icon="🧱"
            onPress={() => navigation.navigate('WallCovering')}
          />

          <CategoryCard
            title="Tiles"
            icon="⬜"
            isComingSoon
            onPress={() => navigation.navigate('ComingSoon', { category: 'Tiles' })}
          />

          <CategoryCard
            title="Carpet"
            icon="🟫"
            isComingSoon
            onPress={() => navigation.navigate('ComingSoon', { category: 'Carpet' })}
          />

          <CategoryCard
            title="MDF"
            icon="🪵"
            isComingSoon
            onPress={() => navigation.navigate('ComingSoon', { category: 'MDF' })}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Estimate Assistant</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  categoriesContainer: {
    padding: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
