import { orgMoment } from '@belloai/moment'
export const getEventDate = (item, _moment = orgMoment) => {
  const { event_date, year } = item || {}

  if (`${event_date || ''}` === `${year || ''}`) {
    return `${event_date || ''}`
  }

  if (event_date) {
    return _moment(event_date).format('YYYY/MM')
  }

  return `${year || ''}` || ''
}

// TODO 待重构
export const transformEnhance = (
  data: any[] = [],
  keyword,
  type,
  _moment = orgMoment
) => {
  if (data && data.length) {
    const temp = data[0] as any
    const res = {
      ...temp,
      name: temp.name, // 名字
      address: temp.city || '', // 所在城市
      intruduction: temp.profile || '', // 简介
      logo: '', // logo
      establish_at: '', // 创建时间
      tags: temp.tags || [] // 标签
    } as any
    const history: any[] = [] // 发展历程
    const leaders: any[] = [] // 管理团队
    const industries: any[] = [] // 行业

    // 公司数据
    if (temp && type === 'ncom') {
      res.company_products = temp.products || [] // 产品
      res.company_size = temp.scale || '' // 公司规模
      res.company_url = temp.url || '' // 公司网址
      res.english_name = temp.en_name || '' // 英文名
      res.finance_stage = '' // 融资阶段
      res.history = [] // 发展历程
      res.industries = '' // 行业
      res.leaders = [] // 管理团队
      res.short_name = temp.shortName || '' // 简称
      res.tags = temp.tags || [] // 标签

      // 处理行业
      if (temp.industry) industries.push(temp.industry)
      if (temp.subindustry && !industries.includes(temp.subindustry)) {
        industries.push(temp.subindustry)
      }
      res.industries = industries.join('、')

      // 处理链接
      if (
        res.company_url &&
        typeof res.company_url === 'string' &&
        res.company_url.indexOf('http') === -1
      ) {
        res.company_url = `http://${res.company_url}`
      }
    }

    // 学校数据
    if (temp && type === 'nixt') {
      res.college_category = temp.type || '' // 学校类别
      res.college_type = temp.college_type || '' // 学校类型
      res.core_majors = temp.major || [] // 核心专业
      res.domestic_ranking = temp.domestic_ranking || '' // 国内排名
      res.english_name = temp.foreign_name || '' // 英文名称
      res.international_ranking = temp.international_ranking || '' // 国际排名
      res.school_tags = temp.plan || [] // 学校标签
      res.school_url = temp.url || '' // 产品

      // 处理链接
      if (
        res.school_url &&
        typeof res.school_url === 'string' &&
        res.school_url.indexOf('http') === -1
      ) {
        res.school_url = `http://${res.school_url}`
      }
    }

    // 项目数据
    if (temp && type === '') {
      res.product_tags = temp.product_tags || []

      // 处理行业
      if (temp.industry) industries.push(temp.industry)
      if (temp.subindustry && !industries.includes(temp.subindustry)) {
        industries.push(temp.subindustry)
      }
      res.industries = industries.join('、')

      // 处理链接
      if (
        res.product_url &&
        typeof res.product_url === 'string' &&
        res.product_url.indexOf('http') === -1
      ) {
        res.product_url = `http://${res.product_url}`
      }
    }

    // 处理创建时间
    if (temp.create_at) {
      res.establish_at = _moment(new Date(temp.create_at)).format('YYYY')
    }

    // 处理logo
    if (temp.logo_url) {
      res.logo = temp.logo_url
    }

    // 处理管理团队
    if (temp.leaders && Array.isArray(temp.leaders)) {
      temp.leaders.forEach(item => {
        leaders.push({
          name: item.name,
          position: item.position,
          remark: item.profile
        })
      })
      res.leaders = leaders
    }

    // 处理发展历程
    if (temp.history && Array.isArray(temp.history)) {
      temp.history.forEach(item => {
        const eventName: any[] = []
        if (item.event_profile) eventName.push(item.event_profile)
        if (item.finance_stage) eventName.push(item.finance_stage)
        if (item.invest_money) eventName.push(item.invest_money)

        history.push({
          eventDate: getEventDate(item, _moment),
          eventName: item.event_name || eventName.join(','),
          eventUrl: item.event_url
        })
      })
      res.history = history
    }

    return res
  }
  return { name: keyword }
}
