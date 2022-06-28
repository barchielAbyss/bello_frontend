import {
  getBirthday,
  getChannelName,
  getIsNew,
  getLockParams,
  getShowLock,
  getWorkYear,
  resumeFixAge,
  exportUrl,
  isWomen,
  isMan,
  getDefName
} from '../resume'
import { orgMoment as moment, transformTimeToUtc } from '@belloai/moment'

describe('src/utils/transform/resume', () => {
  it('getChannelName', () => {
    expect(getChannelName({})).toBe('企业人才库')
    expect(getChannelName({ import_type: 'user.xiaobei' })).toBe('小倍优选入库')
    expect(getChannelName({ import_type: 'user.accept_referral' })).toBe(
      '推荐入库'
    )

    expect(getChannelName({ import_type: 'user.plugin' })).toBe('')
    expect(getChannelName({ import_type: 'xclient.resume_deliver' })).toBe('')
    expect(getChannelName({ import_type: 'wechat.helper' })).toBe('')
    expect(getChannelName({ import_type: 'wechat.consultant' })).toBe('')
    expect(getChannelName({ import_type: 'user.email' })).toBe('')
    expect(getChannelName({ import_type: 'user.upload' })).toBe('')

    expect(
      getChannelName({ import_type: 'user.plugin', source_channel: 'lagou' })
    ).toBe('拉勾')
    expect(
      getChannelName({
        import_type: 'xclient.resume_deliver',
        source_channel: 'lagou'
      })
    ).toBe('拉勾')
    expect(
      getChannelName({ import_type: 'wechat.helper', source_channel: 'lagou' })
    ).toBe('拉勾')
    expect(
      getChannelName({
        import_type: 'wechat.consultant',
        source_channel: 'lagou'
      })
    ).toBe('拉勾')
    expect(
      getChannelName({ import_type: 'user.email', source_channel: 'lagou' })
    ).toBe('拉勾')

    expect(getChannelName({ import_type: 'user.manual' })).toBe('主动上传')
  })

  it('getLockParams', () => {
    expect(
      JSON.stringify(
        getLockParams({
          lock: {
            unlock_date: moment().add(1, 'days'),
            recruiting: 'recruiting'
          }
        })
      )
    ).toBe(
      JSON.stringify({
        showLock: true,
        lockRecruitingId: 'recruiting'
      })
    )

    expect(
      JSON.stringify(
        getLockParams({
          lock: {
            unlock_date: moment().add(-1, 'days'),
            recruiting: {
              id: 'recruiting'
            }
          }
        })
      )
    ).toBe(
      JSON.stringify({
        showLock: false,
        lockRecruitingId: 'recruiting'
      })
    )
  })

  it('getShowLock', () => {
    expect(getShowLock({})).toBe(false)
    expect(getShowLock({ lock: {} })).toBe(false)
    expect(getShowLock({ lock: { unlock_date: '' } })).toBe(false)
    expect(
      getShowLock({
        lock: { unlock_date: undefined, created_at: '2021-05-01' }
      })
    ).toBe(true)
    expect(
      getShowLock({ lock: { unlock_date: moment().add(1, 'days') } })
    ).toBe(true)
    expect(
      getShowLock({ lock: { unlock_date: moment().add(-1, 'days') } })
    ).toBe(false)
  })

  it('getWorkYear', () => {
    const start_year_of_employment1 = moment()
      .add(-18, 'year')
      .add(1, 'month')
      .format()
    const test1 = getWorkYear({
      start_year_of_employment: start_year_of_employment1
    })
    expect(test1).toBe(18)

    // 验证四舍
    const start_year_of_employment2 = moment()
      .add(-18, 'year')
      .add(-4, 'month')
      .startOf('date')
      .startOf('day')
      .format()
    const test2 = getWorkYear({
      start_year_of_employment: start_year_of_employment2
    })
    expect(test2).toBe(18)

    const test3 = getWorkYear(
      {
        start_year_of_employment: start_year_of_employment2
      },
      false
    )
    expect(test3).toBe(18.333333333333332)

    const test4 = getWorkYear(
      {
        year_of_work_experience: 18
      },
      false
    )
    expect(test4).toBe(18)

    // 验证五入
    const start_year_of_employment3 = moment()
      .add(-18, 'year')
      .add(-7, 'month')
      .startOf('date')
      .startOf('day')
      .format()
    const test5 = getWorkYear({
      start_year_of_employment: start_year_of_employment3
    })
    expect(test5).toBe(19)
  })

  it('getBirthday', () => {
    const birthday1 = moment().add(-18, 'year').add(1, 'month').format()
    const test1 = getBirthday({
      birthday: birthday1
    })
    expect(JSON.stringify(test1)).toBe(
      JSON.stringify({
        age: 17,
        birthday: moment(birthday1).format('YYYY.MM.DD')
      })
    )

    const birthday2 = moment().add(-18, 'year').add(-1, 'month').format()
    const test2 = getBirthday({
      birthday: birthday2
    })
    expect(JSON.stringify(test2)).toBe(
      JSON.stringify({
        age: 18,
        birthday: moment(birthday2).format('YYYY.MM.DD')
      })
    )
  })

  it('resumeFixAge', () => {
    const test1 = resumeFixAge({ age: '', b: 1 })
    expect(JSON.stringify(test1)).toBe(JSON.stringify({ b: 1 }))

    const test2 = resumeFixAge({ age: 1 })
    expect(JSON.stringify(test2)).toBe(
      JSON.stringify({
        age: 1
      })
    )

    const test3 = resumeFixAge({ age: 'a' })
    expect(JSON.stringify(test3)).toBe(JSON.stringify({}))
  })

  it('getIsNew', () => {
    const test = { created_at: '2021-10-01T00:00:00' }
    expect(getIsNew(test)).toBe(false)

    const test1 = { created_at: '2021-10-10T00:00:00' }
    expect(
      getIsNew(test1, transformTimeToUtc(moment(test1.created_at).add(-1, 'd')))
    ).toBe(true)
  })

  it('exportUrl', () => {
    expect(exportUrl('a', 'b')).toBe('b/a/export')
  })
  it('isWomen', () => {
    expect(isWomen({ gender: '男' })).toBe(false)
    expect(isWomen({ gender: '' })).toBe(false)
    expect(isWomen({ gender: '女' })).toBe(true)
  })
  it('isMan', () => {
    expect(isMan({ gender: '男' })).toBe(true)
    expect(isMan({ gender: '女' })).toBe(false)
    expect(isMan({ gender: '' })).toBe(false)
  })
  it('getDefName', () => {
    expect(
      getDefName({
        name: 'b',
        surname: 'c'
      })
    ).toBe('b')

    expect(
      getDefName({
        name: '',
        surname: 'c',
        gender: '男'
      })
    ).toBe('c先生')
    expect(
      getDefName({
        name: '',
        surname: 'c',
        gender: '女'
      })
    ).toBe('c女士')
    expect(
      getDefName({
        name: '',
        surname: 'c',
        gender: ''
      })
    ).toBe('c**')
    expect(
      getDefName({
        name: '',
        surname: '',
        gender: ''
      })
    ).toBe('匿名')
  })
})
