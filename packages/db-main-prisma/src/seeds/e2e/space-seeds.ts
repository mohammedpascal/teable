/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma } from '../../';
import { AbstractSeed } from '../seed.abstract';
import { CREATE_USER_NUM, generateUser } from './user-seeds';

const userId = 'usrTestUserId';
const baseId = 'bseTestBaseId';
const baseName = 'Base';
const collaboratorId = 'usrTestCollaboratorId';
const generateBase = (): Prisma.BaseCreateInput => {
  return {
    id: baseId,
    name: baseName,
    order: 1,
    userId: userId, // Set owner for permission checks
    createdBy: userId,
    lastModifiedBy: userId,
  };
};

export const generateCollaborator = async (
  connectUserNum: number
): Promise<Prisma.CollaboratorUncheckedCreateInput[]> => {
  const userSets = await generateUser(connectUserNum);

  return Array.from({ length: connectUserNum + 1 }, (_, i) => ({
    id: `${collaboratorId}_${i}`,
    resourceId: baseId,
    resourceType: 'base',
    roleName: 'owner',
    principalId: userSets[i].id!,
    principalType: 'user',
    createdBy: userSets[i].id!,
  }));
};

export class BaseSeeds extends AbstractSeed {
  execute = async (): Promise<void> => {
    await this.prisma.$transaction(async (tx) => {
      // Base
      await this.createBase(tx);

      // Collaborator
      await this.createCollaborator(tx);
    });
  };

  private async createBase(tx: Prisma.TransactionClient) {
    const { id: baseId, ...baseNonUnique } = generateBase();
    const base = await tx.base.upsert({
      where: { id: baseId },
      update: baseNonUnique,
      create: { id: baseId, ...baseNonUnique },
    });
    this.log('UPSERT', `Base ${base.id} - ${base.name}`);

    if (this.driver !== 'sqlite3') {
      await tx.$executeRawUnsafe(`create schema if not exists "${baseId}"`);
      await tx.$executeRawUnsafe(`revoke all on schema "${baseId}" from public`);
    }
  }

  private async createCollaborator(tx: Prisma.TransactionClient) {
    const collaboratorSets = await generateCollaborator(CREATE_USER_NUM);
    for (const c of collaboratorSets) {
      const { id, resourceId, principalId, ...collaboratorNonUnique } = c;
      const collaborator = await tx.collaborator.upsert({
        where: { id, resourceId, resourceType: 'base', principalId },
        update: collaboratorNonUnique,
        create: c,
      });
      this.log(
        'UPSERT',
        `Collaborator ${collaborator.id} - ${collaborator.resourceId} - ${collaborator.principalId}`
      );
    }
  }
}
