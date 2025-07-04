import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Food } from './MealCard';

interface MealPlanPDFProps {
  meals: {
    time: string;
    name: string;
    foods: Food[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
  totalDailyCalories: number;
  totalDailyProtein: number;
  totalDailyCarbs: number;
  totalDailyFat: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  totalMacros: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 15,
    marginBottom: 30,
    borderRadius: 8,
  },
  macroItem: {
    width: '25%',
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  meal: {
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  mealTimeContainer: {
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mealMacros: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'flex-end',
  },
  macroText: {
    fontSize: 12,
    color: '#1f2937',
    width: 60,
    textAlign: 'right',
  },
  food: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 12,
    color: '#1f2937',
  },
  foodAmount: {
    fontSize: 10,
    color: '#6b7280',
  },
  foodMacros: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'flex-end',
  },
  foodMacroText: {
    fontSize: 12,
    color: '#1f2937',
    width: 60,
    textAlign: 'right',
  },
});

const MealPlanPDF: React.FC<MealPlanPDFProps> = ({
  meals,
  totalDailyCalories,
  totalDailyProtein,
  totalDailyCarbs,
  totalDailyFat,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Plano Alimentar</Text>
        <Text style={styles.subtitle}>Plano personalizado para seus objetivos</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalMacros}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalDailyCalories}</Text>
          <Text style={styles.macroLabel}>Calorias</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalDailyProtein}g</Text>
          <Text style={styles.macroLabel}>Proteína</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalDailyCarbs}g</Text>
          <Text style={styles.macroLabel}>Carboidratos</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalDailyFat}g</Text>
          <Text style={styles.macroLabel}>Gorduras</Text>
        </View>
      </View>

      {meals.map((meal, index) => (
        <View key={index} style={styles.meal}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTimeContainer}>
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text style={styles.mealName}>{meal.name}</Text>
            </View>
            <View style={styles.mealMacros}>
              <Text style={styles.macroText}>{meal.totalCalories} kcal</Text>
              <Text style={styles.macroText}>{meal.totalProtein}g</Text>
              <Text style={styles.macroText}>{meal.totalCarbs}g</Text>
              <Text style={styles.macroText}>{meal.totalFat}g</Text>
            </View>
          </View>

          {meal.foods.map((food, foodIndex) => (
            <View key={foodIndex} style={styles.food}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodAmount}>{food.amount}</Text>
              </View>
              <View style={styles.foodMacros}>
                <Text style={styles.foodMacroText}>{food.calories} kcal</Text>
                <Text style={styles.foodMacroText}>{food.protein}g</Text>
                <Text style={styles.foodMacroText}>{food.carbs}g</Text>
                <Text style={styles.foodMacroText}>{food.fat}g</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default MealPlanPDF; 