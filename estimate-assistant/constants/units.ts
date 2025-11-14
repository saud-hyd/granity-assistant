// Unit types for the application
export type LengthUnit = 'inches' | 'feet' | 'yards' | 'meters';

// Unit conversion factors (all relative to feet as base unit)
export const UNIT_TO_FEET: Record<LengthUnit, number> = {
  inches: 1 / 12,
  feet: 1,
  yards: 3,
  meters: 3.28084,
};

// Convert from feet to other units
export const FEET_TO_UNIT: Record<LengthUnit, number> = {
  inches: 12,
  feet: 1,
  yards: 1 / 3,
  meters: 0.3048,
};

// Unit display labels
export const UNIT_LABELS: Record<LengthUnit, string> = {
  inches: 'Inches',
  feet: 'Feet',
  yards: 'Yards',
  meters: 'Meters',
};

// Available units for different inputs
export const ROLL_WIDTH_UNITS: LengthUnit[] = ['inches', 'feet', 'yards', 'meters'];
export const WALL_DIMENSION_UNITS: LengthUnit[] = ['feet', 'inches', 'meters', 'yards'];
export const OUTPUT_UNITS: LengthUnit[] = ['yards', 'feet', 'meters'];

// Default units
export const DEFAULT_ROLL_WIDTH_UNIT: LengthUnit = 'inches';
export const DEFAULT_WALL_DIMENSION_UNIT: LengthUnit = 'feet';
export const DEFAULT_OUTPUT_UNIT: LengthUnit = 'yards';
