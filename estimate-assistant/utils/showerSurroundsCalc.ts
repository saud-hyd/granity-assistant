import { LengthUnit, UNIT_TO_FEET } from '../constants/units';

export interface ShowerSurroundsInputs {
  backPanelWidth: number;
  backPanelWidthUnit: LengthUnit;
  sidePanelWidth: number;
  sidePanelWidthUnit: LengthUnit;
  panelHeight: number;
  panelHeightUnit: LengthUnit;
}

export interface ShowerSurroundsAreaResult {
  backPanelAreaSqFt: number;
  sidePanelsAreaSqFt: number;
  totalAreaSqFt: number;
}

export interface ShowerPricingInputs {
  areaSqFt: number;
  pricePerSqFt: number;
  pricePerEdgeTrim: number;
}

export interface ShowerPricingResult {
  priceExcludingTrims: number;
  priceIncludingTrims: number;
  edgeTrimsTotal: number;
}

/**
 * Convert a value from a length unit to feet
 */
export const convertToFeet = (value: number, unit: LengthUnit): number => {
  return value * UNIT_TO_FEET[unit];
};

/**
 * Calculate the total area of shower surrounds in square feet
 *
 * Formula: ((back panel width * panel height) + (2 * (side panel width * panel height)))
 * Always converted into sqft only.
 */
export const calculateShowerSurroundsArea = (
  inputs: ShowerSurroundsInputs
): ShowerSurroundsAreaResult => {
  const backWidthFeet = convertToFeet(inputs.backPanelWidth, inputs.backPanelWidthUnit);
  const sideWidthFeet = convertToFeet(inputs.sidePanelWidth, inputs.sidePanelWidthUnit);
  const heightFeet = convertToFeet(inputs.panelHeight, inputs.panelHeightUnit);

  if (backWidthFeet <= 0 || sideWidthFeet <= 0 || heightFeet <= 0) {
    throw new Error('All dimensions must be greater than zero');
  }

  const backPanelAreaSqFt = backWidthFeet * heightFeet;
  const sidePanelsAreaSqFt = 2 * (sideWidthFeet * heightFeet);
  const totalAreaSqFt = backPanelAreaSqFt + sidePanelsAreaSqFt;

  return {
    backPanelAreaSqFt,
    sidePanelsAreaSqFt,
    totalAreaSqFt,
  };
};

/**
 * Calculate shower surround package pricing
 *
 * Formulas:
 * 1. Excluding Edge Trims: Area * pricing per sqft
 * 2. Including Edge Trims: (Area * pricing per sqft) + (2 * Pricing per edge trim)
 */
export const calculateShowerPricing = (
  inputs: ShowerPricingInputs
): ShowerPricingResult => {
  const { areaSqFt, pricePerSqFt, pricePerEdgeTrim } = inputs;

  const priceExcludingTrims = areaSqFt * pricePerSqFt;
  const edgeTrimsTotal = 2 * pricePerEdgeTrim;
  const priceIncludingTrims = priceExcludingTrims + edgeTrimsTotal;

  return {
    priceExcludingTrims,
    priceIncludingTrims,
    edgeTrimsTotal,
  };
};

/**
 * Format a number to a specified number of decimal places
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};
