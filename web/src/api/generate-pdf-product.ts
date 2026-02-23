import apiMutator from '@/lib/axios'

interface GeneratePdfProductRequest {
  customerName: string
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

export async function generatePdfProduct(data: GeneratePdfProductRequest) {
  try {
    const response = await apiMutator<Blob>({
      url: `/pdf/generate-product`,
      method: 'POST',
      responseType: 'blob',
      data,
    })

    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    // Sanitiza o nome do cliente para usar no nome do arquivo
    const safeName = data.customerName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-zA-Z0-9]/g, '-') // substitui espaços/especiais por -
      .toLowerCase()

    const link = document.createElement('a')
    link.href = url
    link.download = `orcamento-${safeName}.pdf`
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response
  } catch (error) {
    console.error('Erro ao baixar PDF de produtos:', error)
    throw error
  }
}
