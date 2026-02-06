import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#fff' },
    header: {
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: '#007bff',
    },
    companyBox: {
        backgroundColor: '#007bff',
        padding: 10,
        marginBottom: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    companyCnpj: {
        fontSize: 10,
        color: '#e3f2fd',
    },
    proposalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'right',
        paddingVertical: 8,
    },
    section: { marginBottom: 18 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    text: { fontSize: 10, color: '#666', marginBottom: 4, lineHeight: 1.4 },
    table: { width: '100%', marginTop: 10 },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 10,
        minHeight: 40,
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
    },
    tableCell: {
        fontSize: 10,
        color: '#555',
        paddingHorizontal: 5,
        flexWrap: 'wrap',
        lineHeight: 1.4,
    },
    serviceItem: {
        marginBottom: 10,
        padding: 8,
        backgroundColor: '#fafafa',
        borderLeftWidth: 3,
        borderLeftColor: '#007bff',
        borderRadius: 2,
    },
    serviceTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    serviceDescription: {
        fontSize: 9.5,
        color: '#666',
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    totalSection: {
        alignItems: 'flex-end',
        marginTop: 20,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: '#007bff',
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
    companyImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    companyNameBox: {
        flexDirection: 'column',
    },
})

interface BudgetPdfDocumentProps {
    imgUrl: string
    nameUser: string
    nameCustomer: string
    emailCustomer: string
    phoneCustomer: string
    total: string
    services: {
        id: string
        name: string
        description: string
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
        <Document title={`Proposta ${props.nameCustomer}`}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companyBox}>
                        <Image style={styles.companyImage} src={props.imgUrl} />
                        <View style={styles.companyNameBox}>
                            <Text style={styles.companyName}>{props.nameUser}</Text>
                            <Text style={styles.companyCnpj}>CNPJ: 00.000.000/0000-00</Text>
                        </View>
                    </View>
                    <Text style={styles.proposalTitle}>ORÇAMENTO</Text>
                </View>

                {/* Cliente */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cliente</Text>
                    <Text style={styles.text}>Nome: {props.nameCustomer}</Text>
                    <Text style={styles.text}>Email: {props.emailCustomer}</Text>
                    <Text style={styles.text}>Telefone: {props.phoneCustomer}</Text>
                </View>

                {/* Itens */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Itens da Proposta</Text>
                    {props.services.map((item, index) => (
                        <View key={item.id} style={styles.serviceItem} wrap={false}>
                            <Text style={styles.serviceTitle}>
                                {index + 1}. {item.name}
                            </Text>
                            <Text style={styles.serviceDescription}>{item.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Total */}
                <View style={styles.totalSection}>
                    <Text style={styles.total}>
                        Total: {formatCurrency(Number(props.total))}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
