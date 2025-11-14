import { Vendor } from './vendorStorage';
import { convertToFeet, convertFromFeet } from './wallCoveringCalc';
import {
  PricingUnit,
  isRollPricingUnit,
  isLinearPricingUnit,
  isAreaPricingUnit,
  LINEAR_TO_PER_YARD,
  AREA_TO_SQ_YARD,
} from '../constants/pricingUnits';

export interface VendorPricing {
  vendor: Vendor;
  rollsNeeded: number; // Exact number (e.g., 2.8) - kept internal for wastage calculation
  rollsToBuy: number; // Rounded up (e.g., 3)
  totalLength: number; // Total length from rolls bought (in yards)
  wastage: number; // Wastage in yards
  totalCost: number; // Total cost in dollars
  pricePerRoll: number; // Price per roll
}

export type SortMode = 'best-price' | 'min-wastage';

/**
 * Convert any pricing unit to price per roll
 * For per-roll pricing: return as-is
 * For linear pricing: price × roll length
 * For area pricing: (price × area per roll) where area = roll length × roll width
 */
export const convertToPricePerRoll = (
  price: number,
  priceUnit: PricingUnit,
  rollLengthInYards: number,
  rollWidthInYards?: number
): number => {
  if (isRollPricingUnit(priceUnit)) {
    // Price is already per roll
    return price;
  } else if (isLinearPricingUnit(priceUnit)) {
    // Convert linear price to per yard first
    const pricePerYard = price * LINEAR_TO_PER_YARD[priceUnit];
    // Then multiply by roll length to get price per roll
    return pricePerYard * rollLengthInYards;
  } else if (isAreaPricingUnit(priceUnit)) {
    // Area-based pricing requires roll width
    if (!rollWidthInYards || rollWidthInYards <= 0) {
      throw new Error('Roll width is required for area-based pricing');
    }

    // Convert area price to per square yard
    const pricePerSqYard = price * AREA_TO_SQ_YARD[priceUnit];

    // Calculate area per roll: roll length × roll width
    const areaPerRoll = rollLengthInYards * rollWidthInYards;

    // Price per roll = price per sq yard × area per roll
    return pricePerSqYard * areaPerRoll;
  }

  throw new Error(`Unknown pricing unit: ${priceUnit}`);
};

/**
 * Calculate pricing for a single vendor
 */
export const calculateVendorPricing = (
  vendor: Vendor,
  requiredLinearYards: number,
  rollWidthInYards: number
): VendorPricing => {
  // Convert roll length to yards
  const rollLengthInFeet = convertToFeet(vendor.rollLength, vendor.rollLengthUnit);
  const rollLengthInYards = convertFromFeet(rollLengthInFeet, 'yards');

  // Calculate exact rolls needed (kept internal for wastage calculation)
  const rollsNeeded = requiredLinearYards / rollLengthInYards;

  // Round up to get rolls to buy
  const rollsToBuy = Math.ceil(rollsNeeded);

  // Calculate total length from rolls bought
  const totalLength = rollsToBuy * rollLengthInYards;

  // Calculate wastage
  const wastage = totalLength - requiredLinearYards;

  // Convert vendor price to price per roll
  const pricePerRoll = convertToPricePerRoll(
    vendor.price,
    vendor.priceUnit,
    rollLengthInYards,
    rollWidthInYards
  );

  // Calculate total cost: rolls to buy × price per roll
  const totalCost = rollsToBuy * pricePerRoll;

  return {
    vendor,
    rollsNeeded,
    rollsToBuy,
    totalLength,
    wastage,
    totalCost,
    pricePerRoll,
  };
};

/**
 * Calculate pricing for all vendors and sort based on mode
 */
export const calculateAllVendorPricing = (
  vendors: Vendor[],
  requiredLinearYards: number,
  rollWidthInYards: number,
  sortMode: SortMode = 'best-price'
): VendorPricing[] => {
  // Calculate pricing for each vendor
  const pricingList = vendors.map((vendor) =>
    calculateVendorPricing(vendor, requiredLinearYards, rollWidthInYards)
  );

  // Sort based on mode
  if (sortMode === 'best-price') {
    // Sort by lowest total cost first
    return pricingList.sort((a, b) => a.totalCost - b.totalCost);
  } else if (sortMode === 'min-wastage') {
    // Sort by lowest wastage first
    return pricingList.sort((a, b) => a.wastage - b.wastage);
  }

  return pricingList;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Format wastage percentage
 */
export const formatWastagePercent = (wastage: number, totalLength: number): string => {
  if (totalLength === 0) return '0%';
  const percent = (wastage / totalLength) * 100;
  return `${percent.toFixed(1)}%`;
};
