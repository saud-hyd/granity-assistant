import { LengthUnit, UNIT_TO_FEET, FEET_TO_UNIT } from '../constants/units';

export interface WallCoveringInputs {
  rollWidth: number;
  rollWidthUnit: LengthUnit;
  wallLength: number;
  wallLengthUnit: LengthUnit;
  wallHeight: number;
  wallHeightUnit: LengthUnit;
  wastagePercent: number;
}

export interface WallCoveringResult {
  linearLength: number;
  unit: LengthUnit;
  wallArea: number; // in square feet
  totalAreaWithWastage: number; // in square feet
}

/**
 * Convert a value from one length unit to feet
 */
export const convertToFeet = (value: number, unit: LengthUnit): number => {
  return value * UNIT_TO_FEET[unit];
};

/**
 * Convert a value from feet to another length unit
 */
export const convertFromFeet = (value: number, unit: LengthUnit): number => {
  return value * FEET_TO_UNIT[unit];
};

/**
 * Calculate the linear length of wall covering needed
 *
 * Formula:
 * 1. Convert all inputs to feet
 * 2. Calculate wall area = length × height
 * 3. Add wastage: total area = area × (1 + wastage/100)
 * 4. Calculate linear length = total area / roll width
 * 5. Convert result to desired output unit
 */
export const calculateWallCovering = (
  inputs: WallCoveringInputs,
  outputUnit: LengthUnit = 'yards'
): WallCoveringResult => {
  // Convert all inputs to feet for calculation
  const rollWidthInFeet = convertToFeet(inputs.rollWidth, inputs.rollWidthUnit);
  const wallLengthInFeet = convertToFeet(inputs.wallLength, inputs.wallLengthUnit);
  const wallHeightInFeet = convertToFeet(inputs.wallHeight, inputs.wallHeightUnit);

  // Validate inputs
  if (rollWidthInFeet <= 0 || wallLengthInFeet <= 0 || wallHeightInFeet <= 0) {
    throw new Error('All dimensions must be greater than zero');
  }

  if (inputs.wastagePercent < 0) {
    throw new Error('Wastage percentage cannot be negative');
  }

  // Calculate wall area in square feet
  const wallArea = wallLengthInFeet * wallHeightInFeet;

  // Add wastage percentage
  const wastageMultiplier = 1 + (inputs.wastagePercent / 100);
  const totalAreaWithWastage = wallArea * wastageMultiplier;

  // Calculate linear length needed in feet
  // Linear length = area / roll width
  const linearLengthInFeet = totalAreaWithWastage / rollWidthInFeet;

  // Convert to output unit
  const linearLength = convertFromFeet(linearLengthInFeet, outputUnit);

  return {
    linearLength,
    unit: outputUnit,
    wallArea,
    totalAreaWithWastage,
  };
};

/**
 * Format a number to a specified number of decimal places
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};
