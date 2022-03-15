import {
  jest,
  expect,
  describe,
  test,
  beforeEach
} from '@jest/globals'
import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";
import config from '../../../server/config';
import { Service } from "../../../server/service";
import TestUtil from "../_util/testUtil.js";
import { join } from 'path'

const {
  dir: {
    publicDirectory
  }
} = config

describe('#Service - test suite api service', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('CreateFileStream() - should create a fileStream', async () => {
    const file = 'validFile.html'
    const mockFileStream = TestUtil.generateReadableStream(["valid"])

    jest.spyOn(fs, 'createReadStream').mockResolvedValue(mockFileStream)

    const service = new Service()

    const response = await service.createFileStream(file)

    expect(response).toEqual(mockFileStream)
    expect(fs.createReadStream).toBeCalledWith(file)
  })

  test('GetFileInfo() - Should return file and type', async () => {
    const file = 'valid.js'
    const fullFilePath = join(publicDirectory, file)
    const FileType = '.js'


    jest.spyOn(path, "join").mockReturnValue(file);
    jest.spyOn(fsPromises, "access").mockResolvedValue();
    jest.spyOn(path, "extname").mockReturnValue(FileType);

    const service = new Service()
    const response = await service.getFileInfo(file)

    expect(fsPromises.access).toBeCalledWith(fullFilePath)
    expect(response).toEqual({
      name: fullFilePath,
      type: FileType
    })
    
  })

  test('GetFileStream() - Should return stream and type', async () => {
    const file = 'valid.js'
    const mockType = '.js'
    const mockFileStream = TestUtil.generateReadableStream(["valid"])

    jest.spyOn(Service.prototype, Service.prototype.getFileInfo.name).mockReturnValue({
      stream: mockFileStream,
      type: mockType
    })

    jest.spyOn(Service.prototype, Service.prototype.createFileStream.name).mockReturnValue(mockFileStream)

    const service = new Service()
    const response = await service.getFileStream(file)

    expect(Service.prototype.getFileInfo).toHaveBeenCalledWith(file);
    expect(response).toEqual({
      stream: mockFileStream,
      type: mockType
    })
  })
})