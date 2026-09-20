import { LengthUnit } from '../constants/units';

export interface DigitalWCInputs {
  width: number;
  widthUnit: LengthUnit;
  height: number;
  heightUnit: LengthUnit;
  bleed: number;
  bleedUnit: LengthUnit;
}

export interface DigitalWCOutputs {
  aInMeters: number;
  bInMeters: number;
  numberOfMuralPanels: number;
  estimatedWidth: number;
  estimatedWidthInInches: number;
  estimatedHeight: number;
  estimatedHeightInInches: number;
  estimatedAreaSqm: number;
  estimatedAreaSqFt: number;
}

export type VendorPriceUnit = 'sqft' | 'sqm' | 'inch' | 'Each';

export interface DigitalWCPricingOutputs {
  vendorPricePerSqFt: number;
  vendorPricePerSqm: number;
  vendorPricePerEach: number;
}

const SQFT_PER_SQM = 10.76391042;
const METERS_TO_INCHES = 1 / 0.0254;

/**
 * Convert length value to meters
 */
export const convertToMeters = (value: number, unit: LengthUnit): number => {
  switch (unit) {
    case 'inches':
      return value * 0.0254;
    case 'feet':
      return value * 0.3048;
    case 'yards':
      return value * 0.9144;
    case 'meters':
      return value;
    default:
      return value;
  }
};

/**
 * Calculate mural panels and estimated dimensions
 *
 * a = width + 2 * required bleed per side (in meters)
 * b = height + 2 * required bleed per side (in meters)
 *
 * Output 3: Number of mural panels - 1.3m width each = Math.ceil(a / 1.3)
 * Output 4:
 *   Estimated width = Math.ceil((a + numberOfMuralPanels * 0.03 * 2) / 1.3) * 1.3
 *   Estimated height = b (in meters)
 *   Both also converted to inches
 */
export const calculateDigitalWC = (inputs: DigitalWCInputs): DigitalWCOutputs => {
  const widthM = convertToMeters(inputs.width, inputs.widthUnit);
  const heightM = convertToMeters(inputs.height, inputs.heightUnit);
  const bleedM = convertToMeters(inputs.bleed, inputs.bleedUnit);

  if (widthM <= 0 || heightM <= 0) {
    throw new Error('Width and Height must be greater than zero');
  }
  if (bleedM < 0) {
    throw new Error('Bleed cannot be negative');
  }

  const aInMeters = widthM + 2 * bleedM;
  const bInMeters = heightM + 2 * bleedM;

  // Number of mural panels - 1.3m width each (rounded up to natural number)
  const numberOfMuralPanels = Math.ceil(aInMeters / 1.3);

  // Estimated width = a + (panels * 0.03 * 2), rounded up to multiple of 1.3
  const rawEstimatedWidth = aInMeters + (numberOfMuralPanels * 0.03 * 2);
  const estimatedWidth = Math.ceil(rawEstimatedWidth / 1.3) * 1.3;

  // Estimated height = b in meters
  const estimatedHeight = bInMeters;

  const estimatedWidthInInches = estimatedWidth * METERS_TO_INCHES;
  const estimatedHeightInInches = estimatedHeight * METERS_TO_INCHES;

  const estimatedAreaSqm = estimatedWidth * estimatedHeight;
  const estimatedAreaSqFt = estimatedAreaSqm * SQFT_PER_SQM;

  return {
    aInMeters,
    bInMeters,
    numberOfMuralPanels,
    estimatedWidth,
    estimatedWidthInInches,
    estimatedHeight,
    estimatedHeightInInches,
    estimatedAreaSqm,
    estimatedAreaSqFt,
  };
};

/**
 * Calculate pricing conversions:
 * vendor price per sqft
 * vendor price per sqm
 * vendor price per Each = Estimated width * Estimated height * Price input (adjusting units as per input)
 * - When input is with meter (sqm): multiply estimated width and height in meters * price input
 * - When input is with inches (inch): multiply estimated width and height in inches * price input
 * - When input is with sqft: multiply estimated width and height in feet * price input
 * - When input is Each: direct price per Each
 */
export const calculateDigitalWCPricing = (
  price: number,
  unit: VendorPriceUnit,
  estimatedWidthM: number,
  estimatedHeightM: number,
  estimatedWidthIn: number,
  estimatedHeightIn: number
): DigitalWCPricingOutputs => {
  // Use clean 2-decimal values as displayed on screen so manual calculation matches exactly
  const wM = parseFloat(estimatedWidthM.toFixed(2));
  const hM = parseFloat(estimatedHeightM.toFixed(2));
  const wIn = parseFloat(estimatedWidthIn.toFixed(2));
  const hIn = parseFloat(estimatedHeightIn.toFixed(2));

  const areaSqm = wM * hM;
  const areaSqIn = wIn * hIn;
  const areaSqFt = areaSqIn / 144;

  let vendorPricePerSqFt = 0;
  let vendorPricePerSqm = 0;
  let vendorPricePerEach = 0;

  if (unit === 'sqm') {
    vendorPricePerSqm = price;
    vendorPricePerSqFt = price / SQFT_PER_SQM;
    // Estimated width (meters) * Estimated height (meters) * Price input
    vendorPricePerEach = wM * hM * price;
  } else if (unit === 'inch') {
    // Estimated width (inches) * Estimated height (inches) * Price input
    vendorPricePerEach = wIn * hIn * price;
    vendorPricePerSqFt = price * 144;
    vendorPricePerSqm = vendorPricePerSqFt * SQFT_PER_SQM;
  } else if (unit === 'sqft') {
    vendorPricePerSqFt = price;
    vendorPricePerSqm = price * SQFT_PER_SQM;
    // Estimated width (feet) * Estimated height (feet) * Price input
    vendorPricePerEach = (wIn / 12) * (hIn / 12) * price;
  } else if (unit === 'Each') {
    vendorPricePerEach = price;
    if (areaSqm > 0) {
      vendorPricePerSqm = price / areaSqm;
    }
    if (areaSqFt > 0) {
      vendorPricePerSqFt = price / areaSqFt;
    }
  }

  return {
    vendorPricePerSqFt,
    vendorPricePerSqm,
    vendorPricePerEach,
  };
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatPrice = (value: number, decimals: number = 2): string => {
  return `$${value.toFixed(decimals)}`;
};
