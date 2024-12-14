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
import { PayableService } from './payable.service';
import Payable from '../entity/Payable';
import PayableCreationDto from './dto/PayableCreationDto';
import { RequestWithUser } from '../types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@Controller('integrations/payable')
@ApiBearerAuth()
@ApiTags('Payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Post('/')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  @ApiBody({
    type: PayableCreationDto,
    description: 'Json structure for user object',
  })
  async createPayableRegister(@Body() payableBody: PayableCreationDto) {
    const payable: Payable = payableBody.toEntity();
    const responsePayable =
      await this.payableService.createPayableRegister(payable);

    return responsePayable;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The records were found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorizeds',
  })
  async findAllPayables() {
    const responsePayables = await this.payableService.findAllPayables();

    return responsePayables;
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
    description: 'Payable id',
  })
  async findPayableById(@Param('id') id: string) {
    const responsePayable = await this.payableService.findPayableById(id);

    return responsePayable;
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
    description: 'Payable id',
  })
  @ApiBody({
    type: PayableCreationDto,
    description: 'Json structure for user object',
  })
  async updatePayableById(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() payableBody: PayableCreationDto,
  ) {
    const { user } = req;
    const payable: Payable = payableBody.toEntity();

    const responsePayable = await this.payableService.updatePayableById(
      id,
      payable,
      user.sub,
    );

    return responsePayable;
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
    description: 'Unauthorized, invalid jwt Token.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Assignor id',
  })
  async deletePayableById(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const { user } = req;

    await this.payableService.deletePayableById(id, user.sub);

    return;
  }

  @Post('/batch')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Batch data processing.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid jwt Token.',
  })
  async processBatch(
    @Req() req: Request,
    @Body() batchData: PayableCreationDto[],
  ) {
    const { user } = req;
    await this.payableService.processBatch(batchData, user);

    return 'Lote em processamento.';
  }
}
