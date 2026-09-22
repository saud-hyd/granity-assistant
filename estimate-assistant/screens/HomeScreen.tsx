import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryCard } from '../components/CategoryCard';

type RootStackParamList = {
  Home: undefined;
  WallCovering: undefined;
  ShowerSurrounds: undefined;
  DigitalWC: undefined;
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
            imageSource={require('../assets/wall-covering-beige-linen.png')}
            onPress={() => navigation.navigate('WallCovering')}
          />

          <CategoryCard
            title="Digitally Printed WC - Janice"
            imageSource={require('../assets/digital-wc-janice-mural.png')}
            onPress={() => navigation.navigate('DigitalWC')}
          />

          <CategoryCard
            title="Shower Surrounds"
            imageSource={require('../assets/shower-surrounds.png')}
            onPress={() => navigation.navigate('ShowerSurrounds')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Copyright 2024 Estimate Assistant</Text>
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
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
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
