/**
 * 单位
 * @power 实时功率
 * @powerConversion 实时功率转换
 * @powerGeneration 发电量
 * @chargingCapacity 充电-总充电量
 * @tower 台数
 * @c 当前有功、功率
 * @generateDay 当日电量
 * */
export default {
  power: 'MW',
  powerConversion: Math.pow(10, 3),
  powerGeneration: 'MWh',
  powerGenerationConversion: Math.pow(10, 3),
  chargingCapacity: 'kWh',
  tower: '台',
  outPower: 'kW',
  generateDay: 'kWh',
};
