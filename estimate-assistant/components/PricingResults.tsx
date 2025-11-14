import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VendorPricing, SortMode, formatCurrency } from '../utils/pricingCalc';
import { formatNumber } from '../utils/wallCoveringCalc';

interface PricingResultsProps {
  pricingList: VendorPricing[];
  sortMode: SortMode;
  onToggleSort: () => void;
}

export const PricingResults: React.FC<PricingResultsProps> = ({
  pricingList,
  sortMode,
  onToggleSort,
}) => {
  if (pricingList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTitle}>No Vendor Pricing Available</Text>
        <Text style={styles.emptyText}>
          Add vendors to see pricing comparisons and find the best deal.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendor Pricing Comparison</Text>
        <TouchableOpacity style={styles.sortToggle} onPress={onToggleSort}>
          <Text style={styles.sortToggleText}>
            {sortMode === 'best-price' ? '💰 Best Price' : '♻️ Min Wastage'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {sortMode === 'best-price'
          ? 'Sorted by lowest total cost'
          : 'Sorted by minimum material wastage'}
      </Text>

      {pricingList.map((pricing, index) => (
        <View
          key={pricing.vendor.id}
          style={[styles.vendorCard, index === 0 && styles.bestVendorCard]}
        >
          {index === 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {sortMode === 'best-price' ? 'BEST PRICE' : 'MIN WASTAGE'}
              </Text>
            </View>
          )}

          <View style={styles.vendorHeader}>
            <Text style={styles.vendorName}>{pricing.vendor.name}</Text>
            <Text style={styles.totalCost}>{formatCurrency(pricing.totalCost)}</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rolls to Buy</Text>
              <Text style={styles.detailValue}>
                {pricing.rollsToBuy} rolls
              </Text>
              <Text style={styles.detailSubtext}>
                {pricing.vendor.rollLength} {pricing.vendor.rollLengthUnit} each
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Length</Text>
              <Text style={styles.detailValue}>
                {formatNumber(pricing.totalLength, 2)} yd
              </Text>
              <Text style={styles.detailSubtext}>
                {pricing.rollsToBuy} × {pricing.vendor.rollLength} {pricing.vendor.rollLengthUnit}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wastage</Text>
              <Text style={[styles.detailValue, pricing.wastage > 0 ? styles.wastageValue : styles.noWastageValue]}>
                {formatNumber(pricing.wastage, 2)} yd
              </Text>
              <Text style={styles.detailSubtext}>
                {formatNumber((pricing.wastage / pricing.totalLength) * 100, 1)}%
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price/Roll</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(pricing.pricePerRoll)}
              </Text>
              <Text style={styles.detailSubtext}>per roll</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.note}>
        * Total cost = Rolls to buy × Price per roll
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  sortToggle: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortToggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  vendorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestVendorCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    backgroundColor: '#f0f7ff',
  },
  badge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  totalCost: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  wastageValue: {
    color: '#FF9500',
  },
  noWastageValue: {
    color: '#34C759',
  },
  detailSubtext: {
    fontSize: 11,
    color: '#999',
  },
  note: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
