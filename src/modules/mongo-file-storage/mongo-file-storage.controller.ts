import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
  Query,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileResponseVm } from './dto/file-response-vm.model';
import { MongoFileStorageService } from './services/mongo-file-storage.service';
import { ApiException } from './dto/api-exception.model';

@ApiTags('Mongo File Storage')
@Controller('mongo-file-storage')
export class MongoFileStorageController {
  constructor(private readonly filesService: MongoFileStorageService) {}
  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({ name: 'bucketName', required: false })
  @UseInterceptors(FilesInterceptor('file'))
  async upload(
    @UploadedFiles() files,
    @Query('bucketName') bucketName?: string,
  ) {
    console.log('files:', files);
    // Check if files exist
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Process and transform files
    const response = files.map((file) => ({
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      id: file.id,
      filename: file.filename,
      metadata: file.metadata,
      bucketName: file.bucketName,
      chunkSize: file.chunkSize,
      size: file.size,
      uploadDate: file.uploadDate,
      contentType: file.contentType,
    }));

    return response;
  }

  @Get('info/:id')
  @ApiQuery({ name: 'bucketName', required: false })
  @ApiBadRequestResponse({ type: ApiException })
  async getFileInfo(
    @Param('id') id: string,
    @Query('bucketName') bucketName?: string,
  ): Promise<FileResponseVm> {
    const bucketNameValue = bucketName || process.env.MONGO_GRIDFS_BUCKET_NAME;
    const file = await this.filesService.findInfo(id, bucketNameValue);
    const filestream = await this.filesService.readStream(id, bucketNameValue);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get(':id')
  @ApiQuery({ name: 'bucketName', required: false })
  @ApiBadRequestResponse({ type: ApiException })
  async getFile(
    @Param('id') id: string,
    @Res() res,
    @Query('bucketName') bucketName?: string,
  ) {
    const bucketNameValue = bucketName || process.env.MONGO_GRIDFS_BUCKET_NAME;
    const file = await this.filesService.findInfo(id, bucketNameValue);
    const filestream = await this.filesService.readStream(id, bucketNameValue);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('download/:id')
  @ApiQuery({ name: 'bucketName', required: false })
  @ApiBadRequestResponse({ type: ApiException })
  async downloadFile(
    @Param('id') id: string,
    @Res() res,
    @Query('bucketName') bucketName?: string,
  ) {
    const bucketNameValue = bucketName || process.env.MONGO_GRIDFS_BUCKET_NAME;
    const file = await this.filesService.findInfo(id, bucketNameValue);
    const filestream = await this.filesService.readStream(id, bucketNameValue);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Delete('delete/:id')
  @ApiQuery({ name: 'bucketName', required: false })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: FileResponseVm })
  async deleteFile(
    @Param('id') id: string,
    @Query('bucketName') bucketName?: string,
  ): Promise<any> {
    const bucketNameValue = bucketName || process.env.MONGO_GRIDFS_BUCKET_NAME;
    const file = await this.filesService.findInfo(id, bucketNameValue);
    await this.filesService.deleteFile(id, bucketNameValue);
    return {
      message: 'File has been deleted',
      file: file,
    };
  }
}
