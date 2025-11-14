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

console.log('=== All tests completed ===');
