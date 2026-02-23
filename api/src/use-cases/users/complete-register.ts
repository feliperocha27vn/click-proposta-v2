import { CpfNotIsValid } from '@/errors/cpf-not-is-valid'
import type { UsersRepository } from '@/repositories/users-respository'
import { isValidCPF } from '@/utils/isValidCpf'

interface CompleteRegisterUserUseCaseRequest {
  userId: string
  phone: string
  cpf: string
  cnpj?: string
}

export class CompleteRegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    phone,
    cpf,
    cnpj,
  }: CompleteRegisterUserUseCaseRequest) {
    if (!isValidCPF(cpf)) {
      throw new CpfNotIsValid()
    }

    await this.usersRepository.completeRegister(userId, {
      cpf: cpf.replace(/\D/g, ''),
      cnpj,
      phone,
      isRegisterComplete: true,
    })
  }
}
