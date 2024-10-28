import { parseStringPromise } from 'xml2js'
import {
  VehicleMakesXmlParser,
  VehicleTypesXmlParser
} from './xml-parser.util'
import {
  ParsedResponseVehicleMakes,
  ParsedResponseVehicleTypes
} from '../types'

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn()
}))

describe('VehicleMakesXmlParser', () => {
  let vehicleMakesXmlParser: VehicleMakesXmlParser

  beforeEach(() => {
    vehicleMakesXmlParser = new VehicleMakesXmlParser()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should parse XML data to JSON correctly', async () => {
    const mockXmlData = '<xml>mocked data</xml>'
    const mockParsedXml = {
      Response: {
        Count: ['1'],
        Message: ['Success'],
        Results: [
          {
            AllVehicleMakes: [{ Make_ID: ['1'], Make_Name: ['Toyota'] }]
          }
        ]
      }
    }
    const expectedParsedData: ParsedResponseVehicleMakes = {
      count: 1,
      message: 'Success',
      results: [{ makeId: 1, makeName: 'Toyota' }]
    };

    (parseStringPromise as jest.Mock).mockResolvedValue(mockParsedXml)

    const result = await vehicleMakesXmlParser.parseXmlToJson(mockXmlData)

    expect(parseStringPromise).toHaveBeenCalledWith(mockXmlData)
    expect(result).toEqual(expectedParsedData)
  })

  it('should throw an error if XML parsing fails', async () => {
    (parseStringPromise as jest.Mock).mockRejectedValue(
      new Error('Parsing failed')
    )

    await expect(
      vehicleMakesXmlParser.parseXmlToJson('<xml>mocked data</xml>')
    ).rejects.toThrow('Error parsing XML: Parsing failed')
    expect(parseStringPromise).toHaveBeenCalled()
  })
})

describe('VehicleTypesXmlParser', () => {
  let vehicleTypesXmlParser: VehicleTypesXmlParser

  beforeEach(() => {
    vehicleTypesXmlParser = new VehicleTypesXmlParser()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should parse XML data to JSON correctly', async () => {
    const mockXmlData = '<xml>mocked data</xml>'
    const mockParsedXml = {
      Response: {
        Count: ['1'],
        Message: ['Success'],
        Results: [
          {
            VehicleTypesForMakeIds: [
              { VehicleTypeId: ['1'], VehicleTypeName: ['SUV'] }
            ]
          }
        ]
      }
    }
    const expectedParsedData: ParsedResponseVehicleTypes = {
      count: 1,
      message: 'Success',
      results: [{ vehicleTypeId: 1, vehicleTypeName: 'SUV' }]
    };

    (parseStringPromise as jest.Mock).mockResolvedValue(mockParsedXml)

    const result = await vehicleTypesXmlParser.parseXmlToJson(mockXmlData)

    expect(parseStringPromise).toHaveBeenCalledWith(mockXmlData)
    expect(result).toEqual(expectedParsedData)
  })

  it('should throw an error if XML parsing fails', async () => {
    (parseStringPromise as jest.Mock).mockRejectedValue(
      new Error('Parsing failed')
    )

    await expect(
      vehicleTypesXmlParser.parseXmlToJson('<xml>mocked data</xml>')
    ).rejects.toThrow('Error parsing XML: Parsing failed')
    expect(parseStringPromise).toHaveBeenCalled()
  })
})
