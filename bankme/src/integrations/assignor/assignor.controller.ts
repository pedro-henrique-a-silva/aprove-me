import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AssignorService } from './assignor.service';
import Assignor from '../entity/Assignor';
import AssignorCreationDto from './dto/AssignorCreationDto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../shared/custom-decorators/is-public.decorator';
import { Request } from 'express';

@Controller('/integrations/assignor')
@ApiBearerAuth()
@ApiTags('Assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Post('')
  @HttpCode(201)
  @Public()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiBody({
    type: AssignorCreationDto,
    description: 'Json structure for user object',
  })
  async createAssignorRegister(@Body() assignorBody: AssignorCreationDto) {
    const assignor: Assignor = assignorBody.toEntity();

    const responseAssignor =
      await this.assignorService.createAssignorRegister(assignor);
    return responseAssignor;
  }

  @Get('/my-info')
  @ApiResponse({
    status: 200,
    description: 'The record was found.',
  })
  @ApiResponse({
    status: 404,
    description: 'The record was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Assignor id',
  })
  async findAssignorSelfInfor(@Req() req: Request) {
    const {id} = req.user;
    console.log(req.user.id);
    const assignor = await this.assignorService.findAssignorById(id);

    return assignor;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record was found.',
  })
  @ApiResponse({
    status: 404,
    description: 'The record was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Assignor id',
  })
  async findAssignorById(@Param('id') id: string) {
    const assignor = await this.assignorService.findAssignorById(id);

    return assignor;
  }

 

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record was updated sucessfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'The record was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Assignor id',
  })
  @ApiBody({
    type: AssignorCreationDto,
    description: 'Json structure for user object',
  })
  async updateAssignorById(
    @Param('id') id: string,
    @Body() assignorBody: AssignorCreationDto,
  ) {
    const assignor = assignorBody.toEntity();

    const responseAssignor = await this.assignorService.updateAssignorById(
      id,
      assignor,
    );

    return responseAssignor;
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The record was deleted sucessfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'The record was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Assignor id',
  })
  async deleteAssignorById(@Param('id') id: string) {
    await this.assignorService.deleteAssignorById(id);

    return;
  }
}
