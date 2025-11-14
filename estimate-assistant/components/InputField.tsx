import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LengthUnit, UNIT_LABELS } from '../constants/units';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  unit: LengthUnit;
  onChangeUnit: (unit: LengthUnit) => void;
  availableUnits: LengthUnit[];
  placeholder?: string;
  isPercentage?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeValue,
  unit,
  onChangeUnit,
  availableUnits,
  placeholder = '0',
  isPercentage = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeValue}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          placeholderTextColor="#999"
        />
        {isPercentage ? (
          <View style={styles.unitContainer}>
            <Text style={styles.percentageText}>%</Text>
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
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
    width: 120,
    height: Platform.OS === 'ios' ? 44 : 48,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 44 : 48,
    width: '100%',
  },
  unitContainer: {
    marginLeft: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
