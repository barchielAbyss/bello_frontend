import { getArrAndFirstParams } from '../index'

describe('packages/transform/src/utils/index.ts', () => {
  it('getArrAndFirstParams', () => {
    expect(
      JSON.stringify(
        getArrAndFirstParams(
          {
            phone: 'phone',
            phones: ['123']
          },
          'phones',
          'phone'
        )
      )
    ).toBe(
      JSON.stringify({
        phones: ['phone', '123'],
        phone: 'phone'
      })
    )

    expect(
      JSON.stringify(
        getArrAndFirstParams(
          {
            phones: ['123']
          },
          'phones',
          'phone'
        )
      )
    ).toBe(
      JSON.stringify({
        phones: ['123'],
        phone: '123'
      })
    )

    expect(
      JSON.stringify(
        getArrAndFirstParams(
          {
            phone: 'phone'
          },
          'phones',
          'phone'
        )
      )
    ).toBe(
      JSON.stringify({
        phones: ['phone'],
        phone: 'phone'
      })
    )

    expect(JSON.stringify(getArrAndFirstParams({}, 'phones', 'phone'))).toBe(
      JSON.stringify({
        phones: [],
        phone: undefined
      })
    )
  })
})
