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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LengthUnit } from '../constants/units';
import {
  calculateDigitalWC,
  calculateDigitalWCPricing,
  DigitalWCOutputs,
  DigitalWCPricingOutputs,
  VendorPriceUnit,
  formatNumber,
  formatPrice,
} from '../utils/digitalWCCalc';
import { RootStackParamList } from '../App';

type DigitallyPrintedWCScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DigitalWC'>;
};

export const DigitallyPrintedWCScreen: React.FC<DigitallyPrintedWCScreenProps> = ({
  navigation,
}) => {
  // Input 1: Dimensions as per drawings/field (2 columns)
  const [width, setWidth] = useState<string>('');
  const [widthUnit, setWidthUnit] = useState<LengthUnit>('inches');

  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<LengthUnit>('inches');

  // Input 2: Required Bleed per side (default 6 inches, editable)
  const [bleed, setBleed] = useState<string>('6');
  const [bleedUnit, setBleedUnit] = useState<LengthUnit>('inches');

  // Input 5: Vendor price with dropdown (sqft, sqm, Each)
  const [vendorPrice, setVendorPrice] = useState<string>('');
  const [vendorPriceUnit, setVendorPriceUnit] = useState<VendorPriceUnit>('sqft');

  // Calculation Results
  const [result, setResult] = useState<DigitalWCOutputs | null>(null);
  const [pricingResult, setPricingResult] = useState<DigitalWCPricingOutputs | null>(null);

  const handleCalculateDimensions = () => {
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const bleedNum = parseFloat(bleed);

    if (isNaN(widthNum) || widthNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid width');
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid height');
      return;
    }

    if (isNaN(bleedNum) || bleedNum < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid bleed per side');
      return;
    }

    try {
      const calcResult = calculateDigitalWC({
        width: widthNum,
        widthUnit,
        height: heightNum,
        heightUnit,
        bleed: bleedNum,
        bleedUnit,
      });

      setResult(calcResult);
      // Pricing results are only calculated when "Calculate Pricing" is clicked
      setPricingResult(null);
    } catch (error) {
      Alert.alert('Calculation Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleCalculatePricing = () => {
    if (!result) {
      Alert.alert('Dimensions Required', 'Please calculate dimensions first');
      return;
    }

    const priceNum = parseFloat(vendorPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid vendor price');
      return;
    }

    const pricing = calculateDigitalWCPricing(
      priceNum,
      vendorPriceUnit,
      result.estimatedWidth,
      result.estimatedHeight,
      result.estimatedWidthInInches,
      result.estimatedHeightInInches
    );
    setPricingResult(pricing);
  };

  const handleClear = () => {
    setWidth('');
    setWidthUnit('inches');
    setHeight('');
    setHeightUnit('inches');
    setBleed('6');
    setBleedUnit('inches');
    setVendorPrice('');
    setVendorPriceUnit('sqft');
    setResult(null);
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
          <Text style={styles.title}>Digitally Printed WC - Janice</Text>
          <Text style={styles.subtitle}>Calculate mural panels, estimated dimensions and pricing</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Input 1: Dimensions as per drawings/field (2 Columns: Width & Height) */}
          <Text style={styles.sectionTitle}>Dimensions as per drawings/field</Text>
          <View style={styles.twoColumnsRow}>
            {/* Column 1: Width */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Width</Text>
              <View style={styles.inputWithUnitRow}>
                <TextInput
                  style={styles.textInput}
                  value={width}
                  onChangeText={setWidth}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={widthUnit}
                    onValueChange={(val) => setWidthUnit(val as LengthUnit)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Inches" value="inches" />
                    <Picker.Item label="Feet" value="feet" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Column 2: Height */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Height</Text>
              <View style={styles.inputWithUnitRow}>
                <TextInput
                  style={styles.textInput}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={heightUnit}
                    onValueChange={(val) => setHeightUnit(val as LengthUnit)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Inches" value="inches" />
                    <Picker.Item label="Feet" value="feet" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          {/* Input 2: Required Bleed per side */}
          <View style={styles.singleFieldContainer}>
            <Text style={styles.fieldLabel}>Required Bleed per side</Text>
            <View style={styles.inputWithUnitRow}>
              <TextInput
                style={styles.textInput}
                value={bleed}
                onChangeText={setBleed}
                placeholder="6"
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.pickerContainerWide}>
                <Picker
                  selectedValue={bleedUnit}
                  onValueChange={(val) => setBleedUnit(val as LengthUnit)}
                  style={styles.picker}
                >
                  <Picker.Item label="Inches" value="inches" />
                  <Picker.Item label="Feet" value="feet" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateDimensions}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Outputs */}
          {result && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsHeader}>Results</Text>

              {/* Output 3: Number of mural panels - 1.3m width each */}
              <View style={styles.panelCard}>
                <Text style={styles.panelCardLabel}>
                  Number of mural panels - 1.3m width each
                </Text>
                <Text style={styles.panelCardValue}>{result.numberOfMuralPanels}</Text>
              </View>

              {/* Output 4: Estimated Dimensions (both in meters as well as inches) */}
              <View style={styles.estimatedDimensionsSection}>
                <Text style={styles.subSectionTitle}>Estimated Dimensions</Text>
                <View style={styles.twoColumnsRow}>
                  {/* Estimated Width */}
                  <View style={[styles.column, styles.estimatedCard]}>
                    <Text style={styles.estimatedCardLabel}>Estimated width</Text>
                    <Text style={styles.estimatedCardValue}>
                      {formatNumber(result.estimatedWidthInInches, 2)} in
                    </Text>
                    <Text style={styles.estimatedCardSubValue}>
                      {formatNumber(result.estimatedWidth, 2)} m
                    </Text>
                  </View>

                  {/* Estimated Depth */}
                  <View style={[styles.column, styles.estimatedCard]}>
                    <Text style={styles.estimatedCardLabel}>Estimated depth</Text>
                    <Text style={styles.estimatedCardValue}>
                      {formatNumber(result.estimatedHeightInInches, 2)} in
                    </Text>
                    <Text style={styles.estimatedCardSubValue}>
                      {formatNumber(result.estimatedHeight, 2)} m
                    </Text>
                  </View>
                </View>
              </View>

              {/* Input 5: Vendor Price */}
              <View style={styles.pricingInputContainer}>
                <Text style={styles.subSectionTitle}>Vendor price</Text>
                <View style={styles.vendorPriceRow}>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.currencyPrefix}>$</Text>
                    <TextInput
                      style={styles.priceTextInput}
                      value={vendorPrice}
                      onChangeText={setVendorPrice}
                      placeholder="Enter price"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.vendorUnitPickerContainer}>
                    <Picker
                      selectedValue={vendorPriceUnit}
                      onValueChange={(val) => setVendorPriceUnit(val as VendorPriceUnit)}
                      style={styles.picker}
                    >
                      <Picker.Item label="sqft" value="sqft" />
                      <Picker.Item label="sqm" value="sqm" />
                      <Picker.Item label="Each" value="Each" />
                    </Picker>
                  </View>
                </View>

                {/* Calculate Pricing Button: required by user prompt */}
                <TouchableOpacity
                  style={styles.calculatePricingButton}
                  onPress={handleCalculatePricing}
                >
                  <Text style={styles.calculatePricingButtonText}>Calculate Pricing</Text>
                </TouchableOpacity>
              </View>

              {/* Output 6: Pricing Results */}
              {pricingResult && (
                <View style={styles.pricingResultsContainer}>
                  <Text style={styles.subSectionTitle}>Pricing results</Text>

                  <View style={styles.priceResultCard}>
                    <Text style={styles.priceResultLabel}>vendor price per sqft</Text>
                    <Text style={styles.priceResultValue}>
                      {formatPrice(pricingResult.vendorPricePerSqFt, 2)}
                    </Text>
                  </View>

                  <View style={styles.priceResultCard}>
                    <Text style={styles.priceResultLabel}>vendor price per sqm</Text>
                    <Text style={styles.priceResultValue}>
                      {formatPrice(pricingResult.vendorPricePerSqm, 2)}
                    </Text>
                  </View>

                  <View style={styles.priceResultCard}>
                    <Text style={styles.priceResultLabel}>vendor price per Each</Text>
                    <Text style={styles.priceResultValue}>
                      {formatPrice(pricingResult.vendorPricePerEach, 2)}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  twoColumnsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  singleFieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWithUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginLeft: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 100,
    height: Platform.OS === 'ios' ? 44 : 48,
    justifyContent: 'center',
  },
  pickerContainerWide: {
    marginLeft: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 120,
    height: Platform.OS === 'ios' ? 44 : 48,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 44 : 48,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 4,
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
  resultsHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  panelCardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  panelCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
  },
  estimatedDimensionsSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  estimatedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  estimatedCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  estimatedCardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  estimatedCardSubValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667085',
    marginTop: 4,
  },
  pricingInputContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: 16,
  },
  vendorPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  priceTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  vendorUnitPickerContainer: {
    marginLeft: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 120,
    height: Platform.OS === 'ios' ? 44 : 48,
    justifyContent: 'center',
  },
  calculatePricingButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  calculatePricingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pricingResultsContainer: {
    marginTop: 8,
  },
  priceResultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priceResultLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  priceResultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
});
