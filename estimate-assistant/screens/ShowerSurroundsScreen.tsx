import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InputField } from '../components/InputField';
import {
  LengthUnit,
  SHOWER_DIMENSION_UNITS,
  DEFAULT_SHOWER_DIMENSION_UNIT,
} from '../constants/units';
import {
  calculateShowerSurroundsArea,
  calculateShowerPricing,
  ShowerSurroundsAreaResult,
  ShowerPricingResult,
  formatNumber,
} from '../utils/showerSurroundsCalc';
import { RootStackParamList } from '../App';

type ShowerSurroundsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ShowerSurrounds'>;
};

export const ShowerSurroundsScreen: React.FC<ShowerSurroundsScreenProps> = ({ navigation }) => {
  // Dimension inputs
  const [backPanelWidth, setBackPanelWidth] = useState<string>('');
  const [backPanelWidthUnit, setBackPanelWidthUnit] = useState<LengthUnit>(DEFAULT_SHOWER_DIMENSION_UNIT);

  const [sidePanelWidth, setSidePanelWidth] = useState<string>('');
  const [sidePanelWidthUnit, setSidePanelWidthUnit] = useState<LengthUnit>(DEFAULT_SHOWER_DIMENSION_UNIT);

  const [panelHeight, setPanelHeight] = useState<string>('');
  const [panelHeightUnit, setPanelHeightUnit] = useState<LengthUnit>(DEFAULT_SHOWER_DIMENSION_UNIT);

  // Pricing inputs (defaults: $4.50/sqft and $12.50/edge trim)
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('4.50');
  const [pricePerEdgeTrim, setPricePerEdgeTrim] = useState<string>('12.50');

  // Calculation results
  const [areaResult, setAreaResult] = useState<ShowerSurroundsAreaResult | null>(null);
  const [pricingResult, setPricingResult] = useState<ShowerPricingResult | null>(null);

  // Recalculate pricing if area already exists and user edits prices
  const updatePricing = (area: number, sqFtPriceStr: string, trimPriceStr: string) => {
    const sqFtPrice = parseFloat(sqFtPriceStr);
    const trimPrice = parseFloat(trimPriceStr);

    if (isNaN(sqFtPrice) || sqFtPrice < 0 || isNaN(trimPrice) || trimPrice < 0) {
      setPricingResult(null);
      return;
    }

    const pricing = calculateShowerPricing({
      areaSqFt: area,
      pricePerSqFt: sqFtPrice,
      pricePerEdgeTrim: trimPrice,
    });
    setPricingResult(pricing);
  };

  const handlePricePerSqFtChange = (text: string) => {
    setPricePerSqFt(text);
    if (areaResult) {
      updatePricing(areaResult.totalAreaSqFt, text, pricePerEdgeTrim);
    }
  };

  const handlePricePerEdgeTrimChange = (text: string) => {
    setPricePerEdgeTrim(text);
    if (areaResult) {
      updatePricing(areaResult.totalAreaSqFt, pricePerSqFt, text);
    }
  };

  const handleCalculate = () => {
    const backW = parseFloat(backPanelWidth);
    const sideW = parseFloat(sidePanelWidth);
    const height = parseFloat(panelHeight);

    if (isNaN(backW) || backW <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid back panel width');
      return;
    }

    if (isNaN(sideW) || sideW <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid side panel width');
      return;
    }

    if (isNaN(height) || height <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid panel height');
      return;
    }

    try {
      const area = calculateShowerSurroundsArea({
        backPanelWidth: backW,
        backPanelWidthUnit,
        sidePanelWidth: sideW,
        sidePanelWidthUnit,
        panelHeight: height,
        panelHeightUnit,
      });

      setAreaResult(area);
      updatePricing(area.totalAreaSqFt, pricePerSqFt, pricePerEdgeTrim);
    } catch (error) {
      Alert.alert('Calculation Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleClear = () => {
    setBackPanelWidth('');
    setBackPanelWidthUnit(DEFAULT_SHOWER_DIMENSION_UNIT);
    setSidePanelWidth('');
    setSidePanelWidthUnit(DEFAULT_SHOWER_DIMENSION_UNIT);
    setPanelHeight('');
    setPanelHeightUnit(DEFAULT_SHOWER_DIMENSION_UNIT);
    setPricePerSqFt('4.50');
    setPricePerEdgeTrim('12.50');
    setAreaResult(null);
    setPricingResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Shower Surrounds</Text>
          <Text style={styles.subtitle}>Calculate panel area and package pricing</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Dimension Inputs */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Panel Dimensions</Text>
          </View>

          <InputField
            label="Back Panel Width"
            value={backPanelWidth}
            onChangeValue={setBackPanelWidth}
            unit={backPanelWidthUnit}
            onChangeUnit={setBackPanelWidthUnit}
            availableUnits={SHOWER_DIMENSION_UNITS}
            placeholder="e.g. 60"
          />

          <InputField
            label="Side Panel Width"
            value={sidePanelWidth}
            onChangeValue={setSidePanelWidth}
            unit={sidePanelWidthUnit}
            onChangeUnit={setSidePanelWidthUnit}
            availableUnits={SHOWER_DIMENSION_UNITS}
            placeholder="e.g. 36"
          />

          <InputField
            label="Panel Height"
            value={panelHeight}
            onChangeValue={setPanelHeight}
            unit={panelHeightUnit}
            onChangeUnit={setPanelHeightUnit}
            availableUnits={SHOWER_DIMENSION_UNITS}
            placeholder="e.g. 96"
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Area Output */}
          {areaResult && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results</Text>

              <View style={styles.areaCard}>
                <View style={styles.areaBadgeContainer}>
                  <Text style={styles.areaLabel}>Area</Text>
                  <Text style={styles.areaTag}>sq ft only</Text>
                </View>
                <Text style={styles.areaValue}>{formatNumber(areaResult.totalAreaSqFt, 2)} sq ft</Text>
                <Text style={styles.formulaExplanation}>
                  Formula: (Back Width × Height) + 2 × (Side Width × Height)
                </Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownText}>
                    Back: {formatNumber(areaResult.backPanelAreaSqFt, 2)} sq ft
                  </Text>
                  <Text style={styles.breakdownText}>•</Text>
                  <Text style={styles.breakdownText}>
                    Sides (2x): {formatNumber(areaResult.sidePanelsAreaSqFt, 2)} sq ft
                  </Text>
                </View>
              </View>

              {/* Below Area Output: 5 & 6 Pricing Inputs */}
              <View style={styles.pricingCard}>
                <Text style={styles.pricingSectionTitle}>Price</Text>
                <Text style={styles.pricingSectionSubtitle}>Editable unit rates for package pricing</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Pricing per sq ft</Text>
                  <View style={styles.currencyInputRow}>
                    <Text style={styles.currencyPrefix}>$</Text>
                    <TextInput
                      style={styles.currencyTextInput}
                      value={pricePerSqFt}
                      onChangeText={handlePricePerSqFtChange}
                      placeholder="4.50"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.currencySuffix}>/ sq ft</Text>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Pricing per Edge Trim</Text>
                  <View style={styles.currencyInputRow}>
                    <Text style={styles.currencyPrefix}>$</Text>
                    <TextInput
                      style={styles.currencyTextInput}
                      value={pricePerEdgeTrim}
                      onChangeText={handlePricePerEdgeTrimChange}
                      placeholder="12.50"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.currencySuffix}>/ trim</Text>
                  </View>
                </View>
              </View>

              {/* 7 & 8 Package Pricing Outputs */}
              {pricingResult && (
                <View style={styles.packagePricingContainer}>
                  <Text style={styles.resultsTitle}>Package Pricing</Text>

                  {/* 7. Excluding Edge Trims */}
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>
                      Shower Surrounds Package Pricing Excluding Edge Trims
                    </Text>
                    <Text style={styles.resultValue}>
                      ${formatNumber(pricingResult.priceExcludingTrims, 2)}
                    </Text>
                    <Text style={styles.priceCalculationNote}>
                      Area ({formatNumber(areaResult.totalAreaSqFt, 2)} sq ft) × ${formatNumber(parseFloat(pricePerSqFt) || 0, 2)}
                    </Text>
                  </View>

                  {/* 8. Including Edge Trims */}
                  <View style={[styles.resultCard, styles.resultCardHighlighted]}>
                    <Text style={[styles.resultLabel, styles.resultLabelHighlighted]}>
                      Shower Surrounds Package Pricing Including Edge Trims
                    </Text>
                    <Text style={[styles.resultValue, styles.resultValueHighlighted]}>
                      ${formatNumber(pricingResult.priceIncludingTrims, 2)}
                    </Text>
                    <Text style={[styles.priceCalculationNote, styles.priceCalculationNoteHighlighted]}>
                      (Area × ${formatNumber(parseFloat(pricePerSqFt) || 0, 2)}) + (2 × ${formatNumber(parseFloat(pricePerEdgeTrim) || 0, 2)} = ${formatNumber(pricingResult.edgeTrimsTotal, 2)})
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#4A90E2',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  clearButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  areaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  areaBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  areaLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  areaTag: {
    backgroundColor: '#e6f0fa',
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  areaValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 6,
  },
  formulaExplanation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  breakdownText: {
    fontSize: 13,
    color: '#777',
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pricingSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  pricingSectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 6,
  },
  currencyTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  currencySuffix: {
    fontSize: 14,
    color: '#888',
    marginLeft: 6,
  },
  packagePricingContainer: {
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultCardHighlighted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    borderWidth: 2,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  resultLabelHighlighted: {
    color: '#166534',
  },
  resultValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 6,
  },
  resultValueHighlighted: {
    color: '#15803d',
  },
  priceCalculationNote: {
    fontSize: 12,
    color: '#888',
  },
  priceCalculationNoteHighlighted: {
    color: '#15803d',
    opacity: 0.9,
  },
});
