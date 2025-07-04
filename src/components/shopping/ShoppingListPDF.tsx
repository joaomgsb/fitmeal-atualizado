import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  recipe?: string;
}

interface ShoppingListPDFProps {
  items: ShoppingItem[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 5,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 25,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
  },
  itemContainerChecked: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 3,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: 'medium',
  },
  itemNameChecked: {
    color: '#6b7280',
    textDecoration: 'line-through',
  },
  itemAmount: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  recipeTag: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
  },
  footerBrand: {
    fontSize: 10,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 40,
  },
});

const ShoppingListPDF: React.FC<ShoppingListPDFProps> = ({ items }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Agrupar itens por receita
  const itemsByRecipe = items.reduce((acc, item) => {
    const recipe = item.recipe || 'Itens Avulsos';
    if (!acc[recipe]) {
      acc[recipe] = [];
    }
    acc[recipe].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>FitMeal</Text>
            <Text style={styles.logoSubtext}>Lista de Compras</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Lista de Compras</Text>
        <Text style={styles.subtitle}>
          Sua lista personalizada para uma alimentação fitness
        </Text>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{totalItems}</Text>
            <Text style={styles.summaryLabel}>Total de Itens</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{checkedItems}</Text>
            <Text style={styles.summaryLabel}>Já Comprados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{progressPercentage}%</Text>
            <Text style={styles.summaryLabel}>Progresso</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{Object.keys(itemsByRecipe).length}</Text>
            <Text style={styles.summaryLabel}>Receitas</Text>
          </View>
        </View>

        {/* Items by Recipe */}
        {totalItems > 0 ? (
          Object.entries(itemsByRecipe).map(([recipe, recipeItems]) => (
            <View key={recipe} style={styles.section}>
              <Text style={styles.sectionTitle}>{recipe}</Text>
              {recipeItems.map((item) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.itemContainer,
                    item.checked && styles.itemContainerChecked
                  ]}
                >
                  <View style={[
                    styles.checkbox,
                    item.checked && styles.checkboxChecked
                  ]}>
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.itemContent}>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        styles.itemName,
                        item.checked && styles.itemNameChecked
                      ]}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={styles.itemAmount}>{item.amount}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>
            Sua lista está vazia. Adicione itens para começar suas compras!
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💪 Mantenha o foco nos seus objetivos fitness!
          </Text>
          <Text style={styles.footerBrand}>
            Gerado pela FitMeal
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ShoppingListPDF;