import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Assignor from '../entity/Assignor';
import AssignorRepository from './assignor.repository';
import { IAssignor } from '../types/IAssignor';
import AssignorDto from '../dto/AssignorDto';

@Injectable()
export class AssignorService {
  constructor(private assignorRepository: AssignorRepository) {}

  async createAssignorRegister(assignor: Assignor): Promise<IAssignor> {
    const createdAssignor =
      await this.assignorRepository.createAssignorRegister(assignor);

    return AssignorDto.fromEntity(createdAssignor);
  }

  async findAssignorById(id: string) {
    const assignor = await this.assignorRepository.findAssignorById(id);

    if (!assignor) {
      throw new HttpException('Assignor not found', HttpStatus.NOT_FOUND);
    }

    return AssignorDto.fromEntity(assignor);
  }

  async updateAssignorById(id: string, assignor: Assignor) {
    const updatedAssignor = await this.assignorRepository.updateAssignorById(
      id,
      assignor,
    );

    if (!updatedAssignor) {
      throw new HttpException('Assignor not found', HttpStatus.NOT_FOUND);
    }

    return AssignorDto.fromEntity(updatedAssignor);
  }

  async deleteAssignorById(id: string) {
    const assignor = await this.assignorRepository.deleteAssignorById(id);

    if (!assignor) {
      throw new HttpException('Assignor not found', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
