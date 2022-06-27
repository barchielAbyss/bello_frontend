import {
  getBirthday,
  getChannelName,
  getContactInfo,
  getIsNew,
  getLockParams,
  getOperateInfoChannel,
  getResumeActiveTime,
  getResumeDimensionsParams,
  getShowLock,
  getWorkYear,
  resumeFixAge,
  exportUrl,
  isWomen,
  isMan,
  getName
} from '../resume'
import { orgMoment as moment, transformTimeToUtc } from '@belloai/moment'

describe('src/utils/transform/resume', () => {
  it('getContactInfo', () => {
    expect(JSON.stringify(getContactInfo({}))).toBe(
      JSON.stringify({ phones: [], emails: [], isHideContactInfo: false })
    )

    expect(JSON.stringify(getContactInfo({ phone: 'phone' }))).toBe(
      JSON.stringify({
        phones: ['phone'],
        phone: 'phone',
        emails: [],
        isHideContactInfo: false
      })
    )

    expect(JSON.stringify(getContactInfo({ email: 'email' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: ['email'],
        email: 'email',
        isHideContactInfo: false
      })
    )

    expect(JSON.stringify(getContactInfo({ email: 'email已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: ['email已隐藏'],
        email: 'email已隐藏',
        isHideContactInfo: true
      })
    )

    expect(JSON.stringify(getContactInfo({ phone: 'phone已隐藏' }))).toBe(
      JSON.stringify({
        phones: ['phone已隐藏'],
        phone: 'phone已隐藏',
        emails: [],
        isHideContactInfo: true
      })
    )

    expect(JSON.stringify(getContactInfo({ wechat: 'wechat已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ qq: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ weibo: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ github: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ website: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ linked_in: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
    expect(JSON.stringify(getContactInfo({ personal_url: 'qq已隐藏' }))).toBe(
      JSON.stringify({
        phones: [],
        emails: [],
        isHideContactInfo: true
      })
    )
  })

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
  it('getOperateInfoChannel', () => {
    expect(getOperateInfoChannel({})).toBe('未知方式')

    expect(getOperateInfoChannel({ import_type: 'user.upload' })).toBe(
      '简历上传'
    )
    expect(getOperateInfoChannel({ import_type: 'user.manual' })).toBe(
      '手动创建'
    )
    expect(getOperateInfoChannel({ import_type: 'user.plugin' })).toBe(
      '插件入库'
    )
    expect(
      getOperateInfoChannel({ import_type: 'xclient.resume_deliver' })
    ).toBe('投递简历插件入库')
    expect(getOperateInfoChannel({ import_type: 'user.email' })).toBe(
      '邮箱入库'
    )
    expect(getOperateInfoChannel({ import_type: 'wechat.helper' })).toBe(
      '小程序投递'
    )
    expect(getOperateInfoChannel({ import_type: 'wechat.consultant' })).toBe(
      '小程序导入'
    )
    expect(getOperateInfoChannel({ import_type: 'user.xiaobei' })).toBe(
      '小倍优选入库'
    )
    expect(getOperateInfoChannel({ import_type: 'user.accept_referral' })).toBe(
      '推荐入库'
    )

    expect(
      getOperateInfoChannel({
        import_type: 'user.plugin',
        source_channel: 'lagou'
      })
    ).toBe('拉勾 插件入库')
    expect(
      getOperateInfoChannel({
        import_type: 'xclient.resume_deliver',
        source_channel: 'lagou'
      })
    ).toBe('拉勾 投递简历插件入库')
    expect(
      getOperateInfoChannel({
        import_type: 'wechat.helper',
        source_channel: 'lagou'
      })
    ).toBe('拉勾 小程序投递')
    expect(
      getOperateInfoChannel({
        import_type: 'wechat.consultant',
        source_channel: 'lagou'
      })
    ).toBe('拉勾 小程序导入')
    expect(
      getOperateInfoChannel({
        import_type: 'user.email',
        source_channel: 'lagou'
      })
    ).toBe('拉勾 邮箱入库')
  })

  it('getLockParams', () => {
    expect(JSON.stringify(getLockParams(undefined))).toBe(
      JSON.stringify({
        showLock: false,
        lockRecruitingId: undefined
      })
    )

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
    expect(getShowLock(undefined)).toBe(false)
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
    expect(getIsNew(undefined)).toBeUndefined()

    const test = { created_at: '2021-10-01T00:00:00' }
    expect(getIsNew(test)).toBe(false)

    const test1 = { created_at: '2021-10-10T00:00:00' }
    expect(
      getIsNew(test1, transformTimeToUtc(moment(test1.created_at).add(-1, 'd')))
    ).toBe(true)
  })
  it('getResumeDimensionsParams', () => {
    expect(JSON.stringify(getResumeDimensionsParams(true, 'resume'))).toBe(
      JSON.stringify({
        entity: 'potrait_analysis_distribution_hr_code_list',
        parent: 'potrait_analysis_distribution_hr_code_list__resume'
      })
    )
    expect(JSON.stringify(getResumeDimensionsParams(false, 'resume'))).toBe(
      JSON.stringify({
        entity: 'potrait_analysis_distribution_hh_code_list',
        parent: 'potrait_analysis_distribution_hh_code_list__resume'
      })
    )
    expect(JSON.stringify(getResumeDimensionsParams(true, 'candidate'))).toBe(
      JSON.stringify({
        entity: 'potrait_analysis_distribution_hr_code_list',
        parent: 'potrait_analysis_distribution_hr_code_list__candidate'
      })
    )
    expect(JSON.stringify(getResumeDimensionsParams(false, 'candidate'))).toBe(
      JSON.stringify({
        entity: 'potrait_analysis_distribution_hh_code_list',
        parent: 'potrait_analysis_distribution_hh_code_list__candidate'
      })
    )
  })
  it('getResumeActiveTime', () => {
    expect(getResumeActiveTime({})).toBe('')
    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(new Date())
      })
    ).toBe('刚刚活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-23, 'hours'))
      })
    ).toBe('今日活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-3, 'day'))
      })
    ).toBe('3日内活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-5, 'day'))
      })
    ).toBe('1周内活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-7, 'day'))
      })
    ).toBe('1周内活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-2, 'weeks'))
      })
    ).toBe('2周内活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-21, 'day'))
      })
    ).toBe('3周内活跃')

    expect(
      getResumeActiveTime({
        resume_active_time: transformTimeToUtc(moment().add(-1, 'year'))
      })
    ).toBe('')
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
  it('getName', () => {
    expect(
      getName(
        {
          name: 'b',
          surname: 'c'
        },
        { candidate_name: 'a' }
      )
    ).toBe('a')
    expect(
      getName(
        {
          name: 'b',
          surname: 'c'
        },
        { candidate_name: '' }
      )
    ).toBe('b')
    expect(
      getName(
        {
          name: 'b',
          surname: 'c'
        },
        {}
      )
    ).toBe('b')
    expect(
      getName(
        {
          name: 'b',
          surname: 'c'
        },
        null
      )
    ).toBe('b')
    expect(
      getName(
        {
          name: '',
          surname: 'c',
          gender: '男'
        },
        null
      )
    ).toBe('c先生')
    expect(
      getName(
        {
          name: '',
          surname: 'c',
          gender: '女'
        },
        null
      )
    ).toBe('c女士')
    expect(
      getName(
        {
          name: '',
          surname: 'c',
          gender: ''
        },
        null
      )
    ).toBe('c**')
    expect(
      getName(
        {
          name: '',
          surname: '',
          gender: ''
        },
        null
      )
    ).toBe('匿名')
  })
})
