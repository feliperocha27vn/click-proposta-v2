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

  // ── Cabeçalho solto, SEM borda ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  companyPhone: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#facc15',
    textAlign: 'center',
  },
  companyAddress: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
  },
  companyCnpj: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
  },
  companyEmail: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
  },

  // ── Tabela de itens com borda ──
  outerTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },

  // ── Colunas da tabela de itens ──
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  colItem: {
    flex: 3,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colQty: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colValue: {
    flex: 1.5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  cellTextCenter: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },

  // ── Linha de total ──
  totalRow: {
    flexDirection: 'row',
  },
  totalLabelCell: {
    flex: 3,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalValueCell: {
    flex: 2.5,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
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
  return raw
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
        {/* ── Cabeçalho FORA da tabela, sem borda ── */}
        <View style={styles.header}>
          {props.imgUrl ? (
            <Image style={styles.logo} src={props.imgUrl} />
          ) : (
            <View style={styles.logoPlaceholder} />
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

        {/* ── Tabela de itens COM borda ── */}
        <View style={styles.outerTable}>
          {/* Cabeçalho das colunas */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.colItem}>
              <Text style={styles.headerText}>Item</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.headerText}>Quantidade</Text>
            </View>
            <View style={styles.colValue}>
              <Text style={styles.headerText}> Unitário</Text>
            </View>
          </View>

          {/* Linhas dos itens */}
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

          {/* Linha de total */}
          <View style={styles.totalRow}>
            <View style={styles.totalLabelCell}>
              <Text style={styles.totalLabel}>Valor Total do Orçamento</Text>
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
