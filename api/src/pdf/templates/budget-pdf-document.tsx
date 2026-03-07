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
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  companyImage: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  companySubText: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
  },
  titleSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  docNumber: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  customerBox: {
    marginVertical: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  customerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
  },
  customerText: {
    fontSize: 11,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    minHeight: 30,
  },
  cellItem: {
    width: '10%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  cellDesc: {
    width: '90%',
    padding: 8,
  },
  headerText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 5,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 9,
    color: '#333',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 30,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 100,
    textAlign: 'right',
  },
  observations: {
    marginTop: 20,
    fontSize: 8,
    color: '#666',
    fontStyle: 'italic',
  },
})

interface BudgetPdfDocumentProps {
  imgUrl: string | null
  nameUser: string | null
  documentUser?: string | null
  addressUser?: string | null
  nameCustomer: string
  emailCustomer: string
  phoneCustomer: string
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

export function BudgetPdfDocument(props: BudgetPdfDocumentProps) {
  const formatCurrency = (
    amount: number,
    locale = 'pt-BR',
    currency = 'BRL'
  ) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <Document title={`Orçamento - ${props.nameCustomer}`}>
      <Page size="A4" style={styles.page}>
        {/* Header Tradicional */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {props.imgUrl && (
              <Image style={styles.companyImage} src={props.imgUrl} />
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{props.nameUser}</Text>
              {props.documentUser && (
                <Text style={styles.companySubText}>
                  CNPJ: {props.documentUser}
                </Text>
              )}
              {props.addressUser && (
                <Text style={styles.companySubText}>{props.addressUser}</Text>
              )}
            </View>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>ORÇAMENTO</Text>
            <Text style={styles.docNumber}>
              Data: {new Date().toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>

        {/* Box do Cliente */}
        <View style={styles.customerBox}>
          <Text style={styles.customerTitle}>Dados do Cliente</Text>
          <Text style={styles.customerText}>
            Destinatário: {props.nameCustomer}
          </Text>
        </View>

        {/* Tabela de Serviços */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellItem, styles.headerText]}>Item</Text>
            <Text style={[styles.cellDesc, styles.headerText]}>
              Descrição dos Serviços
            </Text>
          </View>

          {props.services.map((item, index) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={styles.cellItem}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <View style={styles.cellDesc}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.itemDesc}>{item.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Rodapé com Total */}
        <View style={styles.footer}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(Number(props.total))}
            </Text>
          </View>

          <Text style={styles.observations}>
            * Este orçamento tem validade de 10 dias a partir da data de
            emissão. As condições de pagamento serão combinadas diretamente com
            o prestador.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
