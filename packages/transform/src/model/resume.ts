import { cloneDeep, isString } from 'lodash'
import {
  transformDateYM,
  transformYears,
  getFormUtcToLocalMoment,
  getFromNowString,
  orgMoment as moment,
  transformTimeToUtc,
  transformUtcToLocal
} from '@belloai/moment'

import {
  CHANNEL_MAPS,
  GAIN_WAY_MAP,
  SCHOOL_TYPES,
  getAllImportFilterOptions
} from '../config/basic-data'

import { getArrAndFirstParams, getIdForApi, strArrClean } from '../utils'

export interface Action {
  name: string
  order_index: number
  cancel_abort?: boolean
  recruitingID: string
  should_change?: boolean
  actionFunc?: string
  to_state_flow_stage?: Stage
  operation_params_schema?: any
}

interface Stage {
  id: string
  changeActionList?: Action[]
  unchangeActionList?: Action[]
}

export interface RecruitingModel {
  id: string
  is_abort: boolean
  is_archived: boolean
  stage: Stage
}

export interface ResumeModel {
  type: string
  atsShow: boolean

  downloadUrl?: string
  defaultAvatar?: any
  disabledAvatar?: any
  weepAvatar?: any
  smileAvatar?: any

  start_year_of_employment_count?: string
  start_year_of_employment?: any

  order?: any
  age?: number
  birthday?: any

  showBuy?: boolean
  chudianPanel?: boolean

  name?: string
  round?: number
  employments?: any[]
  secondary_employments?: any[]
  projects?: any[]
  educations?: any[]
  trainings?: any[]
  progress?: any[]
  virtual_phone?: string | any
  expired_at_text?: string
  resume_no?: string

  _tags?: Tag[]
  isEdit?: boolean
  isDownload?: boolean

  skills_props?: any[]
  credentials?: any[]

  description?: string
  isNextInterview?: boolean
  source_id?: string
  channelName?: string
  resumeUpdateFromNow?: string
  updateFromNow?: string
  createdFromNow?: string
  suspect_similar?: any[]

  yearOfWorkExperience?: string

  isNew?: boolean

  extraUserInfoList?: any[]

  showLock?: boolean
  lockRecruitingId?: string

  isHideContactInfo: boolean
  phones?: string[]
  phone?: string
  emails?: string[]
  email?: string

  resumeId?: string
  resume_id: string
  recruitings?: RecruitingModel[]
  candidateId?: string
  originRecruitings?: []
}

export const getSocialNetworksKeys = () => {
  return [
    'wechat',
    'qq',
    'weibo',
    'github',
    'website',
    'linked_in',
    'personal_url'
  ]
}
export const LevelImgMap = {
  level_1: require('../assets/images/level_1.png'),
  level_2: require('../assets/images/level_2.png')
}

export const resumeFixAge = resume => {
  if (isString(resume.age)) {
    const { age: ageStr } = resume
    const age = parseInt(ageStr, 10)
    if (!isNaN(age)) {
      resume.age = age
    } else {
      delete resume.age
    }
  }

  return resume
}

export const getWorkYear = (resume, round = true) => {
  const { year_of_work_experience, start_year_of_employment } = resume
  let workYear = year_of_work_experience
  if (start_year_of_employment) {
    workYear = moment()
      .startOf('day')
      .diff(moment(start_year_of_employment), 'year', true)
    if (round) {
      workYear = Math.round(workYear)
    }
  }
  return workYear
}

export const exportUrl = (id, source) => {
  return `${source}/${id}/export`
}

export const isWomen = resume => resume.gender === '女'
export const isMan = resume => resume.gender === '男'

export const getName = (resume, order) => {
  const { candidate_name } = order || {}
  if (candidate_name) {
    return candidate_name
  }

  const { name, surname } = resume

  let returnName = name

  if (!returnName) {
    if (surname) {
      returnName = `${surname}${
        isWomen(resume) ? '女士' : isMan(resume) ? '先生' : '**'
      }`
    } else {
      returnName = '匿名'
    }
  }
  return returnName
}

export const getAvatars = resume => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let defaultAvatar = require('../assets/images/icon_spec_default_avat.png')
  let disabledAvatar = true
  let weepAvatar
  let smileAvatar
  if (isWomen(resume)) {
    defaultAvatar = require('../assets/images/woman-avatar-motion.gif') // 4s
    weepAvatar = require('../assets/images/woman-avatar-motion-cry.gif') // 2s
    smileAvatar = require('../assets/images/woman-avatar-motion-smile.gif') // 1s
    disabledAvatar = false
  } else if (isMan(resume)) {
    defaultAvatar = require('../assets/images/man-avatar-motion.gif') // 2s
    weepAvatar = require('../assets/images/man-avatar-motion-weep.gif') // 2s
    smileAvatar = require('../assets/images/man-avatar-motion-smile.gif') // 2s
    disabledAvatar = false
  }
  return {
    defaultAvatar,
    disabledAvatar,
    weepAvatar,
    smileAvatar
  }
}

export const getRound = resume => {
  const { latest_interview } = resume
  const { round = 0 } = latest_interview || {}
  return round
}

export const getAge = resume => {
  const { birthday, age } = resume

  let returnAge = age
  if (birthday) {
    returnAge = Math.floor(moment().diff(moment(birthday), 'year', true))
  }
  return returnAge
}

export const getBirthday = resume => {
  const { birthday } = resume

  if (birthday) {
    const age = getAge(resume)
    return {
      age,
      birthday: moment(birthday).format('YYYY.MM.DD')
    }
  }

  return {}
}

export const getStartYearOfEmployment = resume => {
  let { start_year_of_employment } = resume
  let start_year_of_employment_count = ''
  if (start_year_of_employment) {
    ;(start_year_of_employment_count = transformYears(
      start_year_of_employment
    )),
      (start_year_of_employment = moment(start_year_of_employment).format(
        'YYYY.MM.DD'
      ))
  }

  return {
    start_year_of_employment_count,
    start_year_of_employment
  }
}

export const getYearOfWorkExperience = resume => {
  let yearOfWorkExperience = '暂无经验'
  const workYear = getWorkYear(resume, false)
  if (workYear > 0 && workYear < 1) {
    yearOfWorkExperience = `不足1年经验`
  } else if (workYear >= 1) {
    yearOfWorkExperience = `${getWorkYear(resume)}年经验`
  }

  return yearOfWorkExperience
}

export const isOsrResume = resume => {
  const { type } = resume || {}
  return type === 'PRIVATE'
}

export const getDownloadUrl = (resume, type) => {
  const { id } = resume
  let downloadUrl = exportUrl(resume.id, 'cloud_resume')
  if (type === 'CANDIDATE') {
    downloadUrl = exportUrl(id, 'osr_candidate')
  } else if (isOsrResume({ type })) {
    downloadUrl = exportUrl(id, 'osr_resume')
  } else if (type === 'THIRDPARTY') {
    downloadUrl = exportUrl(id, 'third_party_resume')
  } else if (type === 'PLUGIN') {
    downloadUrl = ''
  }
  return downloadUrl
}

export const transfromDate = (item, format = 'YYYY.MM') => {
  const { start_date, end_date, to_present } = item

  let start_date_fm = ''
  if (start_date) {
    start_date_fm = moment(start_date).format(format)
  }

  let work_year: string | null = ''
  let end_date_fm = ''
  if (to_present) {
    end_date_fm = '至今'
    work_year = transformDateYM(start_date, new Date())
  } else if (end_date) {
    end_date_fm = moment(end_date).format(format)
    work_year = transformDateYM(start_date, end_date)
  }

  if (!start_date_fm && !end_date_fm) {
    start_date_fm = '未知日期范围'
  }

  return {
    start_date_fm,
    work_year,
    end_date_fm
  }
}

export const getEmployments = resume => {
  const { employments } = resume

  return (employments || []).map(item => {
    const { company_name, company_desc, description } = item
    return {
      ...item,
      ...transfromDate(item),
      company_name: company_name || '未知公司',
      company_desc: (company_desc || '').trim(),
      description: (description || '').trim()
    }
  })
}

export const getSecondaryEmployments = resume => {
  const { secondary_employments } = resume

  return (secondary_employments || []).map(item => {
    const { company_name, company_desc, description } = item
    return {
      ...item,
      ...transfromDate(item),
      company_name: company_name || '未知公司',
      company_desc: (company_desc || '').trim(),
      description: (description || '').trim()
    }
  })
}

export const getProjects = resume => {
  const { projects } = resume

  return (projects || []).map(item => {
    const { description } = item
    return {
      ...item,
      ...transfromDate(item),
      description: (description || '').trim()
    }
  })
}

export const getEducations = resume => {
  const { educations } = resume

  return (educations || []).map(item => {
    const { school_type } = item
    return {
      ...item,
      ...transfromDate(item),
      schoolType: SCHOOL_TYPES[school_type]
    }
  })
}

export const getTrainings = resume => {
  const { trainings } = resume

  return (trainings || []).map(item => {
    return {
      ...item,
      ...transfromDate(item)
    }
  })
}

export const getOrder = (resume, order) => {
  const { order: resumeOrder, my_order } = resume
  let myOrder
  if (
    (!resumeOrder || typeof resumeOrder === 'string') &&
    (my_order || order)
  ) {
    myOrder = my_order || order
  }

  if (myOrder) {
    const { refund_time } = myOrder
    return {
      ...myOrder,
      refund_time: transformUtcToLocal(refund_time, 'YYYY.MM.DD')
    }
  }

  return myOrder
}

export const getProgress = (resume, order) => {
  const { progress } = resume
  const { progress: orderProgress } = order || {}

  const orderProgressMap = {
    init: 1,
    to_contact: 2,
    confirmed: 3,
    called: 4,
    refunded: 5
  }

  return progress || orderProgressMap[orderProgress] || ''
}

export const getVirtualPhone = (resume, order) => {
  const { virtual_phone } = resume
  const { virtual_phone: orderVirtualPhone } = order || {}

  // TODO 需要整理分开 resume 的 virtual_phone 是字符串（插件入库）or 对象的情况（订单相关）
  if (virtual_phone && isString(virtual_phone) && !orderVirtualPhone) {
    return virtual_phone
  }

  const virtualPhone = virtual_phone || orderVirtualPhone

  if (virtualPhone) {
    const { expired_at } = virtualPhone
    const expiredAt = getFormUtcToLocalMoment(expired_at)
    const nowDate = getFormUtcToLocalMoment(moment().format())

    if (expiredAt.isBefore(nowDate)) {
      return
    } else {
      return {
        ...virtualPhone,
        expired_at_text: expiredAt.format('YYYY.MM.DD HH:00')
      }
    }
  }

  return virtualPhone
}

interface Tag {
  type: string
  name: string
}

export const getTags = resume => {
  const { _tags } = resume
  const industry: Tag[] = []
  const other: Tag[] = []
  let num = 0

  const tags = _tags || []

  tags.forEach(tag => {
    if (tag.name === 'industry') {
      tag.type = 'info'
      industry.push(tag)
    } else if (tag.kind === 'good') {
      tag.type = 'blue'
      other.unshift(tag)
      num++
    } else if (tag.kind === 'bad') {
      tag.type = 'warning'
      other.push(tag)
    } else {
      tag.type = 'info'
      other.splice(num, 0, tag)
    }
  })
  // 如果有专升本  则去掉 211 ，985 标签
  const i = other.findIndex(val => val.name === 'education.upgraded')
  if (i > -1) {
    const index211 = other.findIndex(val => val.name === 'education.211')
    if (index211 > -1) {
      other.splice(index211, 1)
    }
    const index985 = other.findIndex(val => val.name === 'education.985')
    if (index985 > -1) other.splice(index985, 1)
  }

  return [...other, ...industry]
}

export const getIsEdit = (resuem, type, order) => {
  const { category } = resuem
  let isEdit = false
  if (['CANDIDATE', 'PRIVATE'].includes(type)) {
    if (category === 2 || order) {
      isEdit = true
    }
  }

  return isEdit
}

export const getIsDownload = type => {
  return type !== 'PLUGIN'
}

export const getSkillsProps = resume => {
  const { skills_props } = resume

  if (Array.isArray(skills_props)) {
    return skills_props.map(prop => {
      let { project_num = 0, skill_num = 0 } = prop
      const { skills } = prop

      if (Array.isArray(skills)) {
        skill_num = skills.length
        skills.forEach(item => {
          const { auth_proj_name } = item
          if (Array.isArray(auth_proj_name)) {
            ++project_num
          }
        })
      }

      return {
        ...prop,
        project_num,
        skill_num
      }
    })
  }

  return skills_props
}

export const getCredentials = resume => {
  const { credentials } = resume
  if (Array.isArray(credentials)) {
    return credentials.filter(({ type, name }) => type || name)
  }
  return credentials
}

export const getDescription = resume => {
  const { summary } = resume

  return (summary || '').trim()
}

export const getIsNextInterview = (resume, order) => {
  const { category, phone } = resume
  return !(category !== 2 && !phone && !getVirtualPhone(resume, order))
}

export const getResumeId = resume => {
  const { id } = resume

  let resumeId = getIdForApi(resume, 'resume')

  resumeId = resumeId || id

  return {
    resumeId,
    resume_id: resumeId
  }
}

export const getSourceId = resume => {
  const { source_id, id, category } = resume
  const resumeId = getIdForApi(resume, 'resume')

  if (category === 2) {
    return resumeId || id
  }
  return resumeId || source_id || id
}

// 转换渠道
export const getChannelName = resume => {
  let name = ''
  const { import_type, source_channel } = resume

  if (['user.manual'].includes(import_type)) {
    name = '主动上传'
  } else if (
    [
      'user.plugin',
      'wechat.helper',
      'wechat.consultant',
      'user.email',
      'xclient.resume_deliver',
      'user.upload',
      'web.resume_deliver'
    ].includes(import_type)
  ) {
    // 插件入库
    if (source_channel) {
      const channelName = CHANNEL_MAPS[source_channel]
      if (channelName && channelName !== '其他') {
        name = channelName
      }
    }
  } else {
    const { label: importType = '企业人才库' } =
      getAllImportFilterOptions().find(
        ({ postValue }) => postValue === import_type
      ) || {}

    name = importType
  }
  return name
}

export const getResumeUpdateFromNow = resume => {
  const { resume_update_time, received_at, channel } = resume

  let resumeUpdateFromNow = resume_update_time // 处理邮箱简历更新时间
  const isEmailImport = (channel || []).indexOf('user.email') > 0
  if (received_at && isEmailImport) {
    resumeUpdateFromNow = received_at
  }

  if (resumeUpdateFromNow) {
    return getFormUtcToLocalMoment(resumeUpdateFromNow).fromNow()
  }

  return ''
}

export const getUpdateFromNow = resume => {
  const { updated_at } = resume

  if (updated_at) {
    return getFormUtcToLocalMoment(updated_at).fromNow()
  }

  return ''
}

export const getCreatedFromNow = resume => {
  const { created_at } = resume

  if (created_at) {
    return getFromNowString(created_at)
  }

  return ''
}

export const getTypeData = type => {
  // TODO 好似没有地方用到
  if (type === 'PLUGIN') {
    return {
      showBuy: false,
      chudianPanel: false
    }
  }
  return {}
}

export const getSimilarResumes = resume => {
  const { suspect_similar } = resume

  return (suspect_similar || []).filter(({ preview_url }) => !!preview_url)
}

export const getPhones = resume => {
  return getArrAndFirstParams(resume, 'phones', 'phone')
}

export const getEmails = resume => {
  return getArrAndFirstParams(resume, 'emails', 'email')
}

export const getIsNew = (resume, day?: string) => {
  const { created_at } = resume || {}
  let isNew
  if (created_at) {
    const days = getFormUtcToLocalMoment(moment(day).format()).diff(
      created_at,
      'd'
    )
    isNew = days < 7
  }

  return isNew
}
// 获取显示锁
export const getShowLock = resume => {
  const { lock } = resume || {}
  const { unlock_date, created_at } = lock || {}

  let showLock = false

  if (unlock_date) {
    showLock = moment(unlock_date).diff(moment(), 'seconds') > 0
  } else if (created_at) {
    showLock = true
  }

  return showLock
}

export const getLockParams = resume => {
  const { lock } = resume || {}
  return {
    showLock: getShowLock(resume),
    lockRecruitingId: getIdForApi(lock, 'recruiting')
  }
}

export const showOwner = item => {
  // 如果是插件自动入库，并且没有联系方式，那么显示企业人才库
  const { phones, emails, auto_save } = item || {}
  return !(
    (phones || []).length === 0 &&
    (emails || []).length === 0 &&
    auto_save
  )
}

export const getOccupantInfo = item => {
  const id = getIdForApi(item, 'owner')
  const infoList: any = []
  if (showOwner(item) && id) {
    infoList.push({
      prefix: '简历拥有者',
      userId: id
    })
  } else {
    infoList.push({
      prefix: '企业人才库'
    })
  }
  return infoList
}

export const getExtraUserInfoList = resume => {
  const { extraUserInfoList } = resume
  if (extraUserInfoList) {
    return extraUserInfoList
  }
  const occupantInfo = getOccupantInfo(resume)
  return occupantInfo
}

export const getContactInfo = resume => {
  const obj = {
    ...getPhones(resume),
    ...getEmails(resume)
  }

  const { phones, emails } = obj

  const arr: string[] = [...(phones || []), ...(emails || [])]

  getSocialNetworksKeys().forEach(key => {
    const val = resume[key]
    if (val) {
      arr.push(val)
    }
  })

  const [first] = strArrClean(arr)

  const isHideContactInfo = (first || '').includes('已隐藏')

  return {
    ...obj,
    isHideContactInfo
  }
}

export const transformResume = (
  temp = {},
  type = 'PRIVATE',
  order = null
): ResumeModel => {
  const res = cloneDeep(temp)
  const myOrder = getOrder(res, order)

  return {
    ...res,
    ...getAvatars(res), // 处理头像
    ...getBirthday(res), // 出生日期
    ...getStartYearOfEmployment(res), // 参加工作时间
    ...getTypeData(type), // 处理插件简历
    type,
    atsShow: true, // 是否显示ats面板
    order: myOrder, // 获取order
    downloadUrl: getDownloadUrl(res, type), // 下载链接
    name: getName(res, myOrder), // 姓名
    round: getRound(res), // 获取面试轮次
    employments: getEmployments(res), // 工作经历
    secondary_employments: getSecondaryEmployments(res), // 实习经历
    projects: getProjects(res), // 项目经历
    educations: getEducations(res), // 教育经历
    trainings: getTrainings(res), //培训经历
    progress: getProgress(res, myOrder), // 流程状态
    virtual_phone: getVirtualPhone(res, myOrder), //获取虚拟号码
    _tags: getTags(res),
    isEdit: getIsEdit(res, type, myOrder),
    isDownload: getIsDownload(type),
    skills_props: getSkillsProps(res), // 处理技能
    credentials: getCredentials(res), // 处理证书
    description: getDescription(res), // 处理自我评价
    isNextInterview: getIsNextInterview(res, myOrder), // 是否可以进入面试
    source_id: getSourceId(res), // 简历源id
    channelName: getChannelName(res), // 处理渠道名字
    resumeUpdateFromNow: getResumeUpdateFromNow(res), // 处理简历更新时间
    updateFromNow: getUpdateFromNow(res),
    createdFromNow: getCreatedFromNow(res),
    suspect_similar: getSimilarResumes(res),
    yearOfWorkExperience: getYearOfWorkExperience(res), //工作经验
    isNew: getIsNew(res),
    extraUserInfoList: getExtraUserInfoList(res),
    ...getLockParams(res),
    ...getContactInfo(res),
    ...getResumeId(res)
  }
}

export const getShowEmployments = resume => {
  const {
    employments = [],
    last_company: lastCompany,
    last_job_title: lastJobTitle
  } = resume || {}

  if (employments.length === 0) {
    if (lastCompany || lastJobTitle) {
      employments.push({
        company_name: lastCompany,
        title: lastJobTitle,
        start_date_fm: '未知日期范围'
      })
    }
  }
  return employments
}

export const getShowEducations = resume => {
  const {
    educations = [],
    last_school: lastSchool,
    last_major: lastMajor
  } = resume
  if (educations.length === 0) {
    if (lastSchool || lastMajor) {
      educations.push({
        showTitle: lastSchool || lastMajor,
        school_name: lastSchool,
        major: lastMajor,
        start_date_fm: '未知日期范围'
      })
    }
  } else {
    educations.forEach(item => {
      const { school_name: schoolName, degree, major } = item
      item.showEduData = [schoolName, degree, major].filter(i => i)
    })
  }

  return educations
}

export const getOperateInfoChannel = resume => {
  // 默认拿history最后一位为默认值，如果没有则去取外层的
  const { import_history } = resume
  const { length } = import_history || []
  let lastHistory
  if (length) {
    lastHistory = import_history[length - 1]
  }
  const { import_type, source_channel, gain_way } = lastHistory || resume

  const channelName = getChannelName({ import_type, source_channel })
  const sourceName = CHANNEL_MAPS[source_channel] || ''
  const gainWayName = GAIN_WAY_MAP[gain_way] || ''

  const { label: importType = '未知方式' } =
    getAllImportFilterOptions().find(
      ({ postValue }) => postValue === import_type
    ) || {}

  const strArr: string[] = []

  if (
    [
      'user.plugin',
      'wechat.helper',
      'wechat.consultant',
      'user.email',
      'xclient.resume_deliver',
      'user.upload'
    ].includes(import_type)
  ) {
    channelName && strArr.push(channelName)
  }
  sourceName && channelName !== sourceName && strArr.push(sourceName)
  gainWayName && strArr.push(gainWayName)
  strArr.push(importType)

  return strArr.join(' ')
}

export const getDefResumeExtra = resume => {
  const { _risks: doubt, _advantages: advantages, downloadUrl } = resume || {}
  return {
    doubt,
    advantages,
    downloadUrl
  }
}
export const getResumeDimensionsParams = (isHR, pageType) => {
  const moduleParams = {
    resume: {
      entity: isHR
        ? 'potrait_analysis_distribution_hr_code_list'
        : 'potrait_analysis_distribution_hh_code_list',
      parent: isHR
        ? 'potrait_analysis_distribution_hr_code_list__resume'
        : 'potrait_analysis_distribution_hh_code_list__resume'
    },
    candidate: {
      entity: isHR
        ? 'potrait_analysis_distribution_hr_code_list'
        : 'potrait_analysis_distribution_hh_code_list',
      parent: isHR
        ? 'potrait_analysis_distribution_hr_code_list__candidate'
        : 'potrait_analysis_distribution_hh_code_list__candidate'
    }
  }
  return moduleParams[pageType]
}

export const getResumeActiveTimeEnum = () => [
  {
    label: '所有时间',
    value: ''
  },
  {
    label: '刚刚活跃',
    value: transformTimeToUtc(moment().subtract(3, 'hour'))
  },
  {
    label: '今日活跃',
    value: transformTimeToUtc(moment().subtract(1, 'days'))
  },
  {
    label: '3日内活跃',
    value: transformTimeToUtc(moment().subtract(3, 'days'))
  },
  {
    label: '1周内活跃',
    value: transformTimeToUtc(moment().subtract(1, 'weeks'))
  },
  {
    label: '2周内活跃',
    value: transformTimeToUtc(moment().subtract(2, 'weeks'))
  },
  {
    label: '3周内活跃',
    value: transformTimeToUtc(moment().subtract(3, 'weeks'))
  },
  {
    label: '1个月内活跃',
    value: transformTimeToUtc(moment().subtract(1, 'months'))
  }
]

export const getResumeActiveTime = (resume: any) => {
  const { resume_active_time } = resume || {}
  if (!resume_active_time) {
    return ''
  }

  const activeTime = moment(resume_active_time).format()
  return (
    getResumeActiveTimeEnum().find(({ value }) => {
      return value && activeTime >= value
    })?.label || ''
  )
}
