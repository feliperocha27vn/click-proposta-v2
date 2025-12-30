export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false

  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0

  return cleanCpf[9] === digit1.toString() && cleanCpf[10] === digit2.toString()
}
