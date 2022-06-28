export const SCHOOL_TYPES = {
  0: '普通院校',
  1: '985院校',
  2: '211院校',
  3: '港澳台院校',
  4: '国外院校',
  5: '中学',
  6: '职业教育',
  7: '培训机构'
}
export enum GAIN_WAY_MAP {
  delivery = '主动投递',
  search = '主动搜索'
}

export enum CHANNEL_MAPS {
  ciwei = '刺猬实习',
  fast_recommend = '快速推荐',
  haitou = '海投网',
  internal_referral = '内部推荐',
  jiangmen = '江门领航人才网',
  lagou = '拉勾',
  liepin = '猎聘企业版',
  lietou = '猎聘猎头版',
  linkedin = '领英',
  linkedin_per = '领英个人版',
  longyou = '龙游人才网',
  maimai = '脉脉',
  minhang = '民航资源网',
  qilu = '齐鲁人才网',
  quzhou = '衢州人才网',
  recruit_104 = '104招聘',
  recruit_official_site = '招聘官网',
  recommend = '职能推荐',
  shixiseng = '实习僧',
  supplier_referral = '猎头供应商',
  tongcheng = '58同城',
  wechat = '微信',
  wuyou = '前程无忧',
  wuyou_jingying = '无忧精英',
  xinan = '新安人才网',
  zhanku = '站酷网',
  zhilian = '智联招聘',
  zhipin = 'Boss直聘',
  zhitong = '智通人才网',
  zhuopin = '智联卓聘',
  campus_recruitment = '校园招聘',
  vip_referral = 'VIP推荐',
  other = '其他',
  // https://www.tapd.cn/23766501/prong/stories/view/1123766501001007324
  official_site_delivery = '官网主动投递',
  customer_talent_pool = '客户人才库',
  customer_recommend = '客户推荐',
  cold_call = 'Cold Call'
}
/**
 * 入库方式
 */

const userUpload = {
  value: 'user.upload',
  label: '简历上传',
  postValue: 'user.upload'
}
const userManual = {
  value: 'user.manual',
  label: '手动创建',
  postValue: 'user.manual'
}
const userPlugin = {
  value: 'user.plugin',
  label: '插件入库',
  postValue: 'user.plugin'
}
const emailPlugin = {
  value: 'xclient.resume_deliver',
  label: '投递简历插件入库',
  postValue: 'xclient.resume_deliver'
}
const userEmail = {
  value: 'user.email',
  label: '邮箱入库',
  postValue: 'user.email'
}
const wechatHelper = {
  value: 'wechat.helper',
  label: '小程序投递',
  postValue: 'wechat.helper'
}
const wechatConsultant = {
  value: 'wechat.consultant',
  label: '小程序导入',
  postValue: 'wechat.consultant'
}
const userXiaobei = {
  value: 'user.xiaobei',
  label: '小倍优选入库',
  postValue: 'user.xiaobei'
}
const userAcceptReferral = {
  value: 'user.accept_referral',
  label: '推荐入库',
  postValue: 'user.accept_referral'
}
const webResumeDeliver = {
  value: 'web.resume_deliver',
  label: '网站投递',
  postValue: 'web.resume_deliver'
}

export const getAllImportFilterOptions = () => [
  userUpload,
  userManual,
  userPlugin,
  emailPlugin,
  userEmail,
  wechatHelper,
  wechatConsultant,
  userXiaobei,
  userAcceptReferral,
  webResumeDeliver
]
