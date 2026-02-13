import apiMutator from '@/lib/axios'

interface GeneratePdfRequest {
  imgUrl: string
  nameUser: string
  nameCustomer: string
  emailCustomer: string
  phoneCustomer: string
  total: string
  services: {
    id: string
    title: string
    description: string
    budgetsId: string | null
  }[]
}

export async function generatePdf(data: GeneratePdfRequest) {
  try {
    const response = await apiMutator<Blob>({
      url: `/pdf/generate`,
      method: 'POST',
      responseType: 'blob',
      data,
    })

    // Criar um blob URL temporário
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    // Criar link temporário e clicar
    const link = document.createElement('a')
    link.href = url
    link.download = 'proposta.pdf'
    document.body.appendChild(link)
    link.click()

    // Limpar
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    throw error
  }
}

export async function regenerateBudgetPdf(budgetId: string) {
  try {
    const response = await apiMutator<Blob>({
      url: `/pdf/regenerate/${budgetId}`,
      method: 'GET',
      responseType: 'blob',
    })

    // Criar um blob URL temporário
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    // Criar link temporário e clicar
    const link = document.createElement('a')
    link.href = url
    link.download = 'proposta.pdf'
    document.body.appendChild(link)
    link.click()

    // Limpar
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    throw error
  }
}
