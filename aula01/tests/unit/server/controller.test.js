import { describe, test, beforeEach, jest } from '@jest/globals'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'

describe('#Controller - test controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('getFileStream() - should return a fileStream with correct parameters', async () => {
    const sut = new Controller()
    const mockedStream = TestUtil.generateReadableStream(['data'])
    const mockedType = 'text/html'

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockedStream,
      type: mockedType
    })

    const result = await sut.getFileStream('test')

    expect(result.stream).toBe(mockedStream)
    expect(Service.prototype.getFileStream).toBeCalledWith('test')
    
  })
})