/**
 * Test file to validate wall covering calculations
 * Run with: npx ts-node test-calculations.ts
 */

import { calculateWallCovering, WallCoveringInputs } from './utils/wallCoveringCalc';

console.log('=== Wall Covering Calculator Tests ===\n');

// Test 1: Basic calculation with all inputs in feet, output in yards
console.log('Test 1: Basic calculation');
const test1: WallCoveringInputs = {
  rollWidth: 2, // 2 feet
  rollWidthUnit: 'feet',
  wallLength: 12, // 12 feet
  wallLengthUnit: 'feet',
  wallHeight: 8, // 8 feet
  wallHeightUnit: 'feet',
  wastagePercent: 10, // 10% wastage
};

const result1 = calculateWallCovering(test1, 'yards');
console.log('Input:');
console.log(`  Roll width: ${test1.rollWidth} ${test1.rollWidthUnit}`);
console.log(`  Wall length: ${test1.wallLength} ${test1.wallLengthUnit}`);
console.log(`  Wall height: ${test1.wallHeight} ${test1.wallHeightUnit}`);
console.log(`  Wastage: ${test1.wastagePercent}%`);
console.log('Output:');
console.log(`  Wall area: ${result1.wallArea.toFixed(2)} sq ft`);
console.log(`  Total with wastage: ${result1.totalAreaWithWastage.toFixed(2)} sq ft`);
console.log(`  Linear length required: ${result1.linearLength.toFixed(2)} ${result1.unit}`);
console.log(`  Expected: ~17.60 yards (96 sq ft / 2 ft width * 1.1 wastage = 52.8 ft = 17.6 yards)`);
console.log();

// Test 2: Mixed units - roll width in inches, wall in feet
console.log('Test 2: Mixed units');
const test2: WallCoveringInputs = {
  rollWidth: 24, // 24 inches = 2 feet
  rollWidthUnit: 'inches',
  wallLength: 10, // 10 feet
  wallLengthUnit: 'feet',
  wallHeight: 10, // 10 feet
  wallHeightUnit: 'feet',
  wastagePercent: 0, // No wastage
};

const result2 = calculateWallCovering(test2, 'feet');
console.log('Input:');
console.log(`  Roll width: ${test2.rollWidth} ${test2.rollWidthUnit} (= 2 feet)`);
console.log(`  Wall length: ${test2.wallLength} ${test2.wallLengthUnit}`);
console.log(`  Wall height: ${test2.wallHeight} ${test2.wallHeightUnit}`);
console.log(`  Wastage: ${test2.wastagePercent}%`);
console.log('Output:');
console.log(`  Wall area: ${result2.wallArea.toFixed(2)} sq ft`);
console.log(`  Total with wastage: ${result2.totalAreaWithWastage.toFixed(2)} sq ft`);
console.log(`  Linear length required: ${result2.linearLength.toFixed(2)} ${result2.unit}`);
console.log(`  Expected: 50.00 feet (100 sq ft / 2 ft width = 50 ft)`);
console.log();

// Test 3: Meters input, output in meters
console.log('Test 3: Metric units');
const test3: WallCoveringInputs = {
  rollWidth: 0.5, // 0.5 meters
  rollWidthUnit: 'meters',
  wallLength: 4, // 4 meters
  wallLengthUnit: 'meters',
  wallHeight: 3, // 3 meters
  wallHeightUnit: 'meters',
  wastagePercent: 15, // 15% wastage
};

const result3 = calculateWallCovering(test3, 'meters');
console.log('Input:');
console.log(`  Roll width: ${test3.rollWidth} ${test3.rollWidthUnit}`);
console.log(`  Wall length: ${test3.wallLength} ${test3.wallLengthUnit}`);
console.log(`  Wall height: ${test3.wallHeight} ${test3.wallHeightUnit}`);
console.log(`  Wastage: ${test3.wastagePercent}%`);
console.log('Output:');
console.log(`  Wall area: ${result3.wallArea.toFixed(2)} sq ft`);
console.log(`  Total with wastage: ${result3.totalAreaWithWastage.toFixed(2)} sq ft`);
console.log(`  Linear length required: ${result3.linearLength.toFixed(2)} ${result3.unit}`);
console.log(`  Expected: ~27.60 meters (12 sq m * 1.15 / 0.5 m width = 27.6 m)`);
console.log();

// Test 4: Edge case - very small roll width in inches
console.log('Test 4: Small roll width');
const test4: WallCoveringInputs = {
  rollWidth: 6, // 6 inches = 0.5 feet
  rollWidthUnit: 'inches',
  wallLength: 8, // 8 feet
  wallLengthUnit: 'feet',
  wallHeight: 8, // 8 feet
  wallHeightUnit: 'feet',
  wastagePercent: 5, // 5% wastage
};

const result4 = calculateWallCovering(test4, 'yards');
console.log('Input:');
console.log(`  Roll width: ${test4.rollWidth} ${test4.rollWidthUnit} (= 0.5 feet)`);
console.log(`  Wall length: ${test4.wallLength} ${test4.wallLengthUnit}`);
console.log(`  Wall height: ${test4.wallHeight} ${test4.wallHeightUnit}`);
console.log(`  Wastage: ${test4.wastagePercent}%`);
console.log('Output:');
console.log(`  Wall area: ${result4.wallArea.toFixed(2)} sq ft`);
console.log(`  Total with wastage: ${result4.totalAreaWithWastage.toFixed(2)} sq ft`);
console.log(`  Linear length required: ${result4.linearLength.toFixed(2)} ${result4.unit}`);
console.log(`  Expected: ~44.80 yards (64 sq ft * 1.05 / 0.5 ft = 134.4 ft = 44.8 yards)`);
console.log();

console.log('=== All Wall Covering tests completed ===\n');

import {
  calculateShowerSurroundsArea,
  calculateShowerPricing,
  ShowerSurroundsInputs,
} from './utils/showerSurroundsCalc';

console.log('=== Shower Surrounds Calculator Tests ===\n');

// Test 5: Shower Surrounds with inches inputs (e.g. 60" back, 36" side, 96" height)
console.log('Test 5: Shower Surrounds with inputs in inches');
const showerTest1: ShowerSurroundsInputs = {
  backPanelWidth: 60, // 60 inches = 5 feet
  backPanelWidthUnit: 'inches',
  sidePanelWidth: 36, // 36 inches = 3 feet
  sidePanelWidthUnit: 'inches',
  panelHeight: 96, // 96 inches = 8 feet
  panelHeightUnit: 'inches',
};

const showerArea1 = calculateShowerSurroundsArea(showerTest1);
console.log('Input:');
console.log(`  Back panel width: ${showerTest1.backPanelWidth} ${showerTest1.backPanelWidthUnit}`);
console.log(`  Side panel width: ${showerTest1.sidePanelWidth} ${showerTest1.sidePanelWidthUnit}`);
console.log(`  Panel height: ${showerTest1.panelHeight} ${showerTest1.panelHeightUnit}`);
console.log('Output:');
console.log(`  Back panel area: ${showerArea1.backPanelAreaSqFt.toFixed(2)} sq ft (Expected: 40.00 sq ft)`);
console.log(`  Side panels area: ${showerArea1.sidePanelsAreaSqFt.toFixed(2)} sq ft (Expected: 48.00 sq ft)`);
console.log(`  Total Area: ${showerArea1.totalAreaSqFt.toFixed(2)} sq ft (Expected: 88.00 sq ft)`);

const pricing1 = calculateShowerPricing({
  areaSqFt: showerArea1.totalAreaSqFt,
  pricePerSqFt: 4.5,
  pricePerEdgeTrim: 12.5,
});
console.log(`  Price excluding trims: $${pricing1.priceExcludingTrims.toFixed(2)} (Expected: $396.00 = 88 * 4.5)`);
console.log(`  Price including trims: $${pricing1.priceIncludingTrims.toFixed(2)} (Expected: $421.00 = 396 + 2 * 12.5)`);
console.log();

// Test 6: Shower Surrounds with inputs in feet (5' back, 3' side, 8' height)
console.log('Test 6: Shower Surrounds with inputs in feet');
const showerTest2: ShowerSurroundsInputs = {
  backPanelWidth: 5,
  backPanelWidthUnit: 'feet',
  sidePanelWidth: 3,
  sidePanelWidthUnit: 'feet',
  panelHeight: 8,
  panelHeightUnit: 'feet',
};

const showerArea2 = calculateShowerSurroundsArea(showerTest2);
console.log(`  Total Area in sq ft: ${showerArea2.totalAreaSqFt.toFixed(2)} (Expected: 88.00 sq ft)`);
console.log();

console.log('=== All tests completed successfully ===');

