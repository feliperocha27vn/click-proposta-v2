import type { UsersRepository } from '@/repositories/users-respository'

interface ChangePlanUserUseCaseRequest {
  userId: string
}

export class ChangePlanUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: ChangePlanUserUseCaseRequest) {
    console.log(
      'ChangePlanUserUseCase: Attempting to change plan for user:',
      userId
    )

    await this.usersRepository.changePlan(userId)

    console.log(
      'ChangePlanUserUseCase: Plan changed successfully for user:',
      userId
    )
  }
}
