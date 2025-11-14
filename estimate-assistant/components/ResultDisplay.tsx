import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LengthUnit, UNIT_LABELS } from '../constants/units';
import { formatNumber } from '../utils/wallCoveringCalc';

interface ResultDisplayProps {
  linearLength: number;
  unit: LengthUnit;
  onChangeUnit: (unit: LengthUnit) => void;
  availableUnits: LengthUnit[];
  wallArea?: number;
  totalArea?: number;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  linearLength,
  unit,
  onChangeUnit,
  availableUnits,
  wallArea,
  totalArea,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Linear Length Required</Text>
        <View style={styles.resultRow}>
          <Text style={styles.resultValue}>{formatNumber(linearLength, 2)}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={unit}
              onValueChange={(itemValue) => onChangeUnit(itemValue as LengthUnit)}
              style={styles.picker}
            >
              {availableUnits.map((unitOption) => (
                <Picker.Item
                  key={unitOption}
                  label={UNIT_LABELS[unitOption]}
                  value={unitOption}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {wallArea !== undefined && totalArea !== undefined && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Calculation Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wall Area:</Text>
            <Text style={styles.detailValue}>{formatNumber(wallArea, 2)} sq ft</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>With Wastage:</Text>
            <Text style={styles.detailValue}>{formatNumber(totalArea, 2)} sq ft</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    opacity: 0.9,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    width: 120,
    height: Platform.OS === 'ios' ? 44 : 48,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 44 : 48,
    width: '100%',
    color: '#ffffff',
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
