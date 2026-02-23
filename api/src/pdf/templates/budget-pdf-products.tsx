import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  companyPhone: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  companyAddress: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  companyCnpj: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  companyEmail: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },

  // Table
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  colItem: {
    flex: 3,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  colQty: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    alignItems: 'center',
  },
  colValue: {
    flex: 1.5,
    padding: 8,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  cellText: {
    fontSize: 9,
    color: '#444',
    lineHeight: 1.5,
  },
  cellTextCenter: {
    fontSize: 9,
    color: '#444',
    textAlign: 'center',
  },

  // Total row
  totalRow: {
    flexDirection: 'row',
  },
  totalLabelCell: {
    flex: 3,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  totalLabelCellQty: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  totalValueCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
})

interface BudgetPdfProductsProps {
  phone: string
  address?: string
  cnpj?: string
  email?: string
  imgUrl?: string | null
  total: string
  services: {
    id: string
    title: string
    description: string
    quantity?: number | null
    price?: number | null
    budgetsId: string | null
  }[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

/** (11) 99999-9999  ou  (11) 9999-9999 */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return raw // devolve original se não bater
}

/** 00.000.000/0000-00 */
function formatCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 14) return raw
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function BudgetPdfProducts(props: BudgetPdfProductsProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {props.imgUrl ? (
            <Image style={styles.logo} src={props.imgUrl} />
          ) : (
            <View style={styles.logo} />
          )}
          <View style={styles.companyInfo}>
            {props.phone && (
              <Text style={styles.companyPhone}>
                Fone: {formatPhone(props.phone)}
              </Text>
            )}
            {props.address && (
              <Text style={styles.companyAddress}>{props.address}</Text>
            )}
            {props.cnpj && (
              <Text style={styles.companyCnpj}>
                CNPJ {formatCnpj(props.cnpj)}
              </Text>
            )}
            {props.email && (
              <Text style={styles.companyEmail}>E-Mail: {props.email}</Text>
            )}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.colItem}>
              <Text style={styles.headerText}>Item</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.headerText}>Quantidade</Text>
            </View>
            <View style={styles.colValue}>
              <Text style={styles.headerText}>Valor</Text>
            </View>
          </View>

          {/* Table Rows */}
          {props.services.map(item => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <View style={styles.colItem}>
                <Text style={styles.cellText}>
                  {item.title}
                  {item.description ? `\n${item.description}` : ''}
                </Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.cellTextCenter}>
                  {item.quantity ?? '-'}
                </Text>
              </View>
              <View style={styles.colValue}>
                <Text style={styles.cellText}>
                  {item.price ? formatCurrency(Number(item.price)) : '-'}
                </Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View style={styles.totalLabelCell}>
              <Text style={styles.totalLabel}>Total</Text>
            </View>
            <View style={styles.totalValueCell}>
              <Text style={styles.totalValue}>
                {formatCurrency(Number(props.total))}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
