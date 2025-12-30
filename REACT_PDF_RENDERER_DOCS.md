# Documentação Completa: React-PDF/Renderer

## 📋 Índice
1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Conceitos Fundamentais](#conceitos-fundamentais)
4. [Componentes Principais](#componentes-principais)
5. [Estilos e Stylesheet](#estilos-e-stylesheet)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Renderização no Servidor](#renderização-no-servidor)
8. [Componentes Avançados](#componentes-avançados)
9. [Boas Práticas](#boas-práticas)
10. [Troubleshooting](#troubleshooting)

---

## Introdução

**React-PDF/Renderer** é uma biblioteca que permite criar documentos PDF usando componentes React. Funciona tanto no navegador quanto no servidor (Node.js), oferecendo uma forma declarativa e familiar para gerar PDFs.

### Características Principais
- ✅ Componentes React para PDF
- ✅ Suporte a CSS-like styling
- ✅ Renderização no servidor e cliente
- ✅ Suporte a SVG e gráficos
- ✅ Formulários interativos
- ✅ Imagens e fontes customizadas
- ✅ Múltiplas páginas
- ✅ Performance otimizada

---

## Instalação

### Via npm
```bash
npm install @react-pdf/renderer
```

### Via yarn
```bash
yarn add @react-pdf/renderer
```

### Via pnpm
```bash
pnpm add @react-pdf/renderer
```

### Pacotes Relacionados (Opcionais)
```bash
# Para renderização de baixo nível
npm install @react-pdf/render

# Para stylesheet avançado
npm install @react-pdf/stylesheet

# Para manipulação de PNG
npm install @react-pdf/png-js
```

---

## Conceitos Fundamentais

### Estrutura Básica

A estrutura de um documento PDF segue uma hierarquia simples:

```
Document
  └── Page
      ├── View
      │   ├── Text
      │   └── Image
      ├── View
      └── ...
```

### Componentes Principais

| Componente | Descrição |
|-----------|-----------|
| `Document` | Container raiz do PDF |
| `Page` | Página individual do documento |
| `View` | Container genérico (como div) |
| `Text` | Texto renderizado |
| `Image` | Imagens (PNG, JPG, etc) |
| `Link` | Links clicáveis |
| `Svg` | Gráficos vetoriais |

---

## Componentes Principais

### Document
Define o documento PDF raiz.

```jsx
import { Document, Page, Text } from '@react-pdf/renderer';

const MyDocument = () => (
  <Document>
    <Page>
      <Text>Conteúdo da página</Text>
    </Page>
  </Document>
);
```

**Props:**
- `title` (string): Título do PDF
- `author` (string): Autor do documento
- `subject` (string): Assunto
- `keywords` (array): Palavras-chave
- `creator` (string): Criador do documento
- `producer` (string): Produtor

### Page
Representa uma página do documento.

```jsx
<Page size="A4" orientation="portrait" style={styles.page}>
  {/* Conteúdo */}
</Page>
```

**Props:**
- `size`: "A4", "Letter", "A3", etc. ou `[width, height]`
- `orientation`: "portrait" ou "landscape"
- `style`: Estilos CSS
- `wrap`: Quebra automática de página (true/false)

### View
Container genérico para layout.

```jsx
<View style={{ flexDirection: 'row', marginBottom: 20 }}>
  <View style={{ flex: 1 }}>Coluna 1</View>
  <View style={{ flex: 1 }}>Coluna 2</View>
</View>
```

**Props:**
- `style`: Estilos CSS
- `children`: Elementos filhos
- `wrap`: Quebra automática
- `fixed`: Posição fixa na página

### Text
Renderiza texto.

```jsx
<Text style={{ fontSize: 12, color: '#000' }}>
  Texto do documento
</Text>
```

**Props:**
- `style`: Estilos CSS
- `children`: Conteúdo do texto
- `render`: Função de renderização customizada

### Image
Incorpora imagens.

```jsx
<Image 
  src="https://example.com/image.png" 
  style={{ width: 200, height: 150 }}
/>
```

**Props:**
- `src`: URL ou base64 da imagem
- `style`: Estilos (width, height, etc)
- `cache`: Cache de imagens (true/false)

### Link
Cria links clicáveis.

```jsx
<Link src="https://example.com" style={{ color: 'blue' }}>
  Clique aqui
</Link>
```

---

## Estilos e Stylesheet

### StyleSheet.create()

Crie estilos otimizados para PDF:

```jsx
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#666666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
```

### Propriedades CSS Suportadas

#### Layout
- `display`: "flex" (padrão)
- `flexDirection`: "row", "column"
- `justifyContent`: "flex-start", "center", "flex-end", "space-between", "space-around"
- `alignItems`: "flex-start", "center", "flex-end", "stretch"
- `flex`: número
- `width`, `height`: pixels ou percentual
- `margin`, `padding`: pixels
- `gap`: espaço entre itens

#### Tipografia
- `fontSize`: número (pixels)
- `fontWeight`: "normal", "bold", ou número (100-900)
- `fontStyle`: "normal", "italic"
- `fontFamily`: nome da fonte
- `color`: cor (hex, rgb, etc)
- `textAlign`: "left", "center", "right", "justify"
- `lineHeight`: número ou percentual

#### Bordas e Fundo
- `borderWidth`: pixels
- `borderColor`: cor
- `borderRadius`: pixels
- `backgroundColor`: cor

#### Transformações
- `transform`: `rotate(45deg)`, `scale(1.5)`, etc
- `opacity`: 0-1

### Exemplo Completo de Estilos

```jsx
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 11,
  },
});
```

---

## Exemplos Práticos

### 1. Documento Simples

```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 12, lineHeight: 1.5 },
});

const SimpleDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Meu Primeiro PDF</Text>
        <Text style={styles.text}>
          Este é um exemplo simples de documento PDF criado com React-PDF.
        </Text>
      </View>
    </Page>
  </Document>
);

export default SimpleDocument;
```

### 2. Proposta Comercial

```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  logo: { width: 100, height: 50 },
  companyName: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  text: { fontSize: 11, color: '#666', marginBottom: 5, lineHeight: 1.4 },
  table: { width: '100%', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 8 },
  tableHeader: { fontWeight: 'bold', backgroundColor: '#f0f0f0', paddingBottom: 8 },
  tableCell: { flex: 1, fontSize: 10 },
  total: { fontSize: 14, fontWeight: 'bold', color: '#007bff', marginTop: 15 },
});

const ProposalDocument = ({ proposal }) => (
  <Document title={`Proposta ${proposal.number}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>Sua Empresa</Text>
          <Text style={styles.text}>CNPJ: 00.000.000/0000-00</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>PROPOSTA</Text>
      </View>

      {/* Informações da Proposta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Proposta</Text>
        <Text style={styles.text}>Número: {proposal.number}</Text>
        <Text style={styles.text}>Data: {new Date().toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.text}>Validade: 30 dias</Text>
      </View>

      {/* Cliente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cliente</Text>
        <Text style={styles.text}>Nome: {proposal.clientName}</Text>
        <Text style={styles.text}>Email: {proposal.clientEmail}</Text>
        <Text style={styles.text}>Telefone: {proposal.clientPhone}</Text>
      </View>

      {/* Itens */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens da Proposta</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Descrição</Text>
          <Text style={styles.tableCell}>Quantidade</Text>
          <Text style={styles.tableCell}>Valor Unit.</Text>
          <Text style={styles.tableCell}>Total</Text>
        </View>
        {proposal.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>R$ {item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.tableCell}>R$ {(item.quantity * item.unitPrice).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
        <Text style={styles.total}>
          Total: R$ {proposal.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
        </Text>
      </View>

      {/* Observações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observações</Text>
        <Text style={styles.text}>{proposal.notes}</Text>
      </View>
    </Page>
  </Document>
);

export default ProposalDocument;
```

### 3. Tabela Estruturada

```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#4472C4', color: '#fff' },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  lastCell: {
    borderRightWidth: 0,
  },
});

const TableDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Relatório de Dados</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Nome</Text>
          <Text style={styles.tableCell}>Email</Text>
          <Text style={styles.tableCell}>Telefone</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>Status</Text>
        </View>

        {/* Linhas */}
        {data.map((row, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.tableCell}>{row.name}</Text>
            <Text style={styles.tableCell}>{row.email}</Text>
            <Text style={styles.tableCell}>{row.phone}</Text>
            <Text style={[styles.tableCell, styles.lastCell]}>{row.status}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default TableDocument;
```

### 4. Múltiplas Páginas

```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#999',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 15 },
  text: { fontSize: 12, lineHeight: 1.5 },
});

const MultiPageDocument = ({ chapters }) => (
  <Document>
    {chapters.map((chapter, idx) => (
      <Page key={idx} size="A4" style={styles.page}>
        <Text style={styles.title}>{chapter.title}</Text>
        <View style={styles.section}>
          <Text style={styles.text}>{chapter.content}</Text>
        </View>
        <Text style={styles.pageNumber}>Página {idx + 1}</Text>
      </Page>
    ))}
  </Document>
);

export default MultiPageDocument;
```

### 5. Formulário Interativo

```jsx
import React from 'react';
import { Document, Page, View, Text, TextInput, Checkbox, Select, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input: { width: '100%', height: 25, borderWidth: 1, borderColor: '#ccc', padding: 5, marginBottom: 10 },
  checkbox: { width: 15, height: 15, marginRight: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});

const FormDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} placeholder="Digite seu nome" />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="seu@email.com" />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} placeholder="(11) 99999-9999" />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Checkbox style={styles.checkbox} />
          <Text>Concordo com os termos e condições</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>País</Text>
        <Select style={styles.input} options={['Brasil', 'Portugal', 'Outro']} />
      </View>
    </Page>
  </Document>
);

export default FormDocument;
```

---

## Renderização no Servidor

### Com Express.js

```javascript
import express from 'express';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import MyDocument from './MyDocument';

const app = express();

app.get('/download-pdf', async (req, res) => {
  try {
    const stream = await renderToStream(<MyDocument />);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');

    stream.pipe(res);

    stream.on('error', (err) => {
      console.error('Erro ao gerar PDF:', err);
      res.status(500).send('Erro ao gerar PDF');
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao processar requisição');
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
```

### Com Next.js (API Route)

```javascript
// pages/api/generate-pdf.js
import { renderToStream } from '@react-pdf/renderer';
import MyDocument from '../../components/MyDocument';

export default async function handler(req, res) {
  try {
    const stream = await renderToStream(<MyDocument />);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
}
```

### Renderização para Buffer

```javascript
import { renderToBuffer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';

async function generatePDF() {
  try {
    const buffer = await renderToBuffer(<MyDocument />);
    // Salvar em arquivo, enviar por email, etc
    fs.writeFileSync('documento.pdf', buffer);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## Componentes Avançados

### SVG e Gráficos

```jsx
import React from 'react';
import { Document, Page, Svg, Circle, Rect, Path, Line, Polygon, G, Defs, LinearGradient, Stop, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  svgContainer: { marginBottom: 20 },
});

const SVGDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Gradiente Linear */}
      <Svg width="200" height="200" viewBox="0 0 200 200" style={styles.svgContainer}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4ecdc4" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x="10" y="10" width="180" height="180" fill="url(#grad1)" rx="10" />
        <Circle cx="100" cy="100" r="40" fill="white" stroke="#333" strokeWidth="2" />
      </Svg>

      {/* Formas Básicas */}
      <Svg width="300" height="100" style={styles.svgContainer}>
        <Path d="M10,50 Q50,10 90,50 T170,50" stroke="#e74c3c" strokeWidth="3" fill="none" />
        <Line x1="10" y1="80" x2="290" y2="80" stroke="#3498db" strokeWidth="2" />
      </Svg>

      {/* Polígono (Estrela) */}
      <Svg width="200" height="200" style={styles.svgContainer}>
        <G transform="translate(100, 100)">
          <Polygon
            points="0,-80 23,-23 80,-23 30,17 47,73 0,35 -47,73 -30,17 -80,-23 -23,-23"
            fill="#f39c12"
            stroke="#e67e22"
            strokeWidth="2"
          />
        </G>
      </Svg>
    </Page>
  </Document>
);

export default SVGDocument;
```

### Componente Customizado Reutilizável

```jsx
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    fontSize: 11,
    color: '#666',
    lineHeight: 1.4,
  },
});

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    <Text style={styles.cardContent}>{children}</Text>
  </View>
);

export default Card;
```

### Header e Footer Customizados

```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#999',
  },
});

const Header = () => (
  <View style={styles.header}>
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Seu Documento</Text>
    <Text style={{ fontSize: 12, color: '#666' }}>Data: {new Date().toLocaleDateString('pt-BR')}</Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer}>
    <Text>© 2024 Sua Empresa. Todos os direitos reservados.</Text>
  </View>
);

const DocumentWithHeaderFooter = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <Text>Conteúdo principal aqui...</Text>
      <Footer />
      <Text style={styles.pageNumber}>Página 1</Text>
    </Page>
  </Document>
);

export default DocumentWithHeaderFooter;
```

---

## Boas Práticas

### 1. Otimização de Performance

```jsx
// ✅ BOM: Memoizar componentes
import React, { useMemo } from 'react';

const OptimizedDocument = ({ data }) => {
  const memoizedContent = useMemo(() => (
    data.map(item => <Item key={item.id} data={item} />)
  ), [data]);

  return <Document>{memoizedContent}</Document>;
};

// ✅ BOM: Usar StyleSheet.create() para estilos
const styles = StyleSheet.create({
  text: { fontSize: 12 },
});

// ❌ RUIM: Criar estilos inline em cada render
const BadComponent = () => (
  <Text style={{ fontSize: 12 }}>Texto</Text>
);
```

### 2. Tratamento de Erros

```jsx
const SafePDFGenerator = ({ data }) => {
  const [error, setError] = React.useState(null);

  const handleGeneratePDF = async () => {
    try {
      const stream = await renderToStream(<MyDocument data={data} />);
      // Processar stream
    } catch (err) {
      setError(err.message);
      console.error('Erro ao gerar PDF:', err);
    }
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return <button onClick={handleGeneratePDF}>Gerar PDF</button>;
};
```

### 3. Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── pdf/
│   │   ├── templates/
│   │   │   ├── ProposalTemplate.jsx
│   │   │   ├── InvoiceTemplate.jsx
│   │   │   └── ReportTemplate.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Table.jsx
│   │   └── styles.js
│   └── ...
├── pages/
│   ├── api/
│   │   └── generate-pdf.js
│   └── ...
└── utils/
    └── pdfGenerator.js
```

### 4. Reutilização de Estilos

```jsx
// styles/pdfStyles.js
import { StyleSheet } from '@react-pdf/renderer';

export const commonStyles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#fff' },
  section: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 12, lineHeight: 1.5, color: '#333' },
  smallText: { fontSize: 10, color: '#666' },
});

// Usar em componentes
import { commonStyles } from '../styles/pdfStyles';

const MyComponent = () => (
  <View style={commonStyles.section}>
    <Text style={commonStyles.title}>Título</Text>
    <Text style={commonStyles.text}>Conteúdo</Text>
  </View>
);
```

### 5. Dados Dinâmicos

```jsx
const DynamicDocument = ({ proposal }) => {
  const calculateTotal = () => {
    return proposal.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Document>
      <Page>
        {proposal.items.map((item, idx) => (
          <View key={idx}>
            <Text>{item.name}</Text>
            <Text>{formatCurrency(item.price)}</Text>
          </View>
        ))}
        <Text>Total: {formatCurrency(calculateTotal())}</Text>
      </Page>
    </Document>
  );
};
```

---

## Troubleshooting

### Problema: Imagens não aparecem

```jsx
// ✅ SOLUÇÃO: Usar URLs absolutas ou base64
<Image src="https://example.com/image.png" />

// Ou converter para base64
import fs from 'fs';
const imageBuffer = fs.readFileSync('image.png');
const base64 = imageBuffer.toString('base64');
<Image src={`data:image/png;base64,${base64}`} />
```

### Problema: Fontes customizadas não funcionam

```jsx
import { Font } from '@react-pdf/renderer';

// Registrar fonte
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.ttf',
});

const styles = StyleSheet.create({
  text: { fontFamily: 'Roboto', fontSize: 12 },
});
```

### Problema: Quebra de página não funciona

```jsx
// ✅ Use wrap={true} em View
<View wrap={true}>
  {/* Conteúdo que pode quebrar */}
</View>

// ✅ Ou crie múltiplas páginas manualmente
<Document>
  <Page>Página 1</Page>
  <Page>Página 2</Page>
</Document>
```

### Problema: Performance lenta com muitos dados

```jsx
// ✅ SOLUÇÃO: Paginar dados
const DocumentWithPagination = ({ items, itemsPerPage = 20 }) => {
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageItems, idx) => (
        <Page key={idx}>
          {pageItems.map(item => (
            <View key={item.id}>{/* Renderizar item */}</View>
          ))}
        </Page>
      ))}
    </Document>
  );
};
```

### Problema: Espaçamento/Layout incorreto

```jsx
// ✅ Use flexDirection e flex para layout
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }}>Coluna 1</View>
  <View style={{ flex: 1 }}>Coluna 2</View>
</View>

// ✅ Use gap para espaçamento entre itens
<View style={{ gap: 10 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

---

## Recursos Adicionais

### Links Úteis
- [Documentação Oficial](https://react-pdf.org/)
- [GitHub Repository](https://github.com/diegomura/react-pdf)
- [Exemplos](https://github.com/diegomura/react-pdf/tree/master/packages/examples)

### Pacotes Complementares
- `@react-pdf/font`: Gerenciamento de fontes
- `@react-pdf/image`: Otimização de imagens
- `@react-pdf/pdfkit`: Renderização de baixo nível

### Alternativas
- **pdfme**: Gerador de PDF com template designer
- **react-print-pdf**: Componentes sem estilo para PDFs
- **PDFSlick**: Visualizador de PDF interativo

---

## Resumo Rápido

| Tarefa | Código |
|--------|--------|
| Criar documento | `<Document><Page>...</Page></Document>` |
| Adicionar texto | `<Text>Conteúdo</Text>` |
| Layout em linha | `<View style={{ flexDirection: 'row' }}>` |
| Estilos | `StyleSheet.create({ ... })` |
| Renderizar no servidor | `renderToStream()` ou `renderToBuffer()` |
| Múltiplas páginas | `<Page>` múltiplos |
| Imagens | `<Image src="..." />` |
| SVG/Gráficos | `<Svg>...</Svg>` |

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0
