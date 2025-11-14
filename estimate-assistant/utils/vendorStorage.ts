import { LengthUnit } from '../constants/units';
import { PricingUnit } from '../constants/pricingUnits';

export interface Vendor {
  id: string;
  name: string;
  price: number;
  priceUnit: PricingUnit;
  rollLength: number;
  rollLengthUnit: LengthUnit;
}

const STORAGE_KEY = 'wall_covering_vendors';

/**
 * Get all vendors from LocalStorage
 */
export const getVendors = (): Vendor[] => {
  try {
    const vendorsJson = localStorage.getItem(STORAGE_KEY);
    if (!vendorsJson) {
      return [];
    }
    return JSON.parse(vendorsJson) as Vendor[];
  } catch (error) {
    console.error('Error loading vendors from storage:', error);
    return [];
  }
};

/**
 * Save a new vendor to LocalStorage
 */
export const saveVendor = (vendor: Omit<Vendor, 'id'>): Vendor => {
  const vendors = getVendors();
  const newVendor: Vendor = {
    ...vendor,
    id: generateId(),
  };
  vendors.push(newVendor);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  return newVendor;
};

/**
 * Update an existing vendor
 */
export const updateVendor = (id: string, updates: Partial<Omit<Vendor, 'id'>>): boolean => {
  const vendors = getVendors();
  const index = vendors.findIndex((v) => v.id === id);

  if (index === -1) {
    return false;
  }

  vendors[index] = { ...vendors[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  return true;
};

/**
 * Delete a vendor by ID
 */
export const deleteVendor = (id: string): boolean => {
  const vendors = getVendors();
  const filteredVendors = vendors.filter((v) => v.id !== id);

  if (filteredVendors.length === vendors.length) {
    return false; // Vendor not found
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVendors));
  return true;
};

/**
 * Generate a unique ID for vendors
 */
const generateId = (): string => {
  return `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
