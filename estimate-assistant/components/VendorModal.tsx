import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Vendor, getVendors, saveVendor, updateVendor, deleteVendor } from '../utils/vendorStorage';
import { PricingUnit, PRICING_UNIT_LABELS, DEFAULT_PRICING_UNIT } from '../constants/pricingUnits';
import { LengthUnit, UNIT_LABELS } from '../constants/units';

interface VendorModalProps {
  visible: boolean;
  onClose: () => void;
  onVendorsChange: () => void;
}

export const VendorModal: React.FC<VendorModalProps> = ({ visible, onClose, onVendorsChange }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState<PricingUnit>(DEFAULT_PRICING_UNIT);
  const [rollLength, setRollLength] = useState('');
  const [rollLengthUnit, setRollLengthUnit] = useState<LengthUnit>('yards');

  useEffect(() => {
    if (visible) {
      loadVendors();
    }
  }, [visible]);

  const loadVendors = () => {
    const loadedVendors = getVendors();
    setVendors(loadedVendors);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setPriceUnit(DEFAULT_PRICING_UNIT);
    setRollLength('');
    setRollLengthUnit('yards');
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSave = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter vendor name');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    const rollLengthNum = parseFloat(rollLength);
    if (isNaN(rollLengthNum) || rollLengthNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid roll length');
      return;
    }

    if (editingId) {
      // Update existing vendor
      updateVendor(editingId, {
        name: name.trim(),
        price: priceNum,
        priceUnit,
        rollLength: rollLengthNum,
        rollLengthUnit,
      });
    } else {
      // Save new vendor
      saveVendor({
        name: name.trim(),
        price: priceNum,
        priceUnit,
        rollLength: rollLengthNum,
        rollLengthUnit,
      });
    }

    resetForm();
    loadVendors();
    onVendorsChange();
  };

  const handleEdit = (vendor: Vendor) => {
    setName(vendor.name);
    setPrice(vendor.price.toString());
    setPriceUnit(vendor.priceUnit);
    setRollLength(vendor.rollLength.toString());
    setRollLengthUnit(vendor.rollLengthUnit);
    setEditingId(vendor.id);
    setIsAddingNew(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Vendor', 'Are you sure you want to delete this vendor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteVendor(id);
          loadVendors();
          onVendorsChange();
        },
      },
    ]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vendor Pricing</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Add New Button */}
          {!isAddingNew && (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingNew(true)}>
              <Text style={styles.addButtonText}>+ Add New Vendor</Text>
            </TouchableOpacity>
          )}

          {/* Add/Edit Form */}
          {isAddingNew && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editingId ? 'Edit Vendor' : 'Add New Vendor'}</Text>

              <Text style={styles.label}>Vendor Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter vendor name"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Price</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={priceUnit}
                    onValueChange={(value) => setPriceUnit(value as PricingUnit)}
                    style={styles.picker}
                  >
                    {Object.entries(PRICING_UNIT_LABELS).map(([key, label]) => (
                      <Picker.Item key={key} label={label} value={key} />
                    ))}
                  </Picker>
                </View>
              </View>

              <Text style={styles.label}>Roll Length</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={rollLength}
                  onChangeText={setRollLength}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={rollLengthUnit}
                    onValueChange={(value) => setRollLengthUnit(value as LengthUnit)}
                    style={styles.picker}
                  >
                    <Picker.Item label={UNIT_LABELS.yards} value="yards" />
                    <Picker.Item label={UNIT_LABELS.feet} value="feet" />
                    <Picker.Item label={UNIT_LABELS.meters} value="meters" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Vendor List */}
          <View style={styles.vendorList}>
            {vendors.length === 0 && !isAddingNew && (
              <Text style={styles.emptyText}>No vendors added yet. Tap "Add New Vendor" to get started.</Text>
            )}

            {vendors.map((vendor) => (
              <View key={vendor.id} style={styles.vendorCard}>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorDetails}>
                    ${vendor.price.toFixed(2)} {PRICING_UNIT_LABELS[vendor.priceUnit]}
                  </Text>
                  <Text style={styles.vendorDetails}>
                    Roll: {vendor.rollLength} {UNIT_LABELS[vendor.rollLengthUnit]}
                  </Text>
                </View>
                <View style={styles.vendorActions}>
                  <TouchableOpacity onPress={() => handleEdit(vendor)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(vendor.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: '#4A90E2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  pickerWrapper: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 150,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 44 : 48,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  vendorList: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  vendorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  vendorDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  vendorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
