import { getCarbonHeatMap } from '@/services/carbon-overview';
import { useRequest } from 'ahooks';
import { Feature, Overlay, View } from 'ol';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import { Point } from 'ol/geom';
import HeatmapLayer from 'ol/layer/Heatmap';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

interface HeatMapInfo {
  type: number; // 分类类型
  substationCode?: string; // 企业code
  industry?: string; // 行业code
}
// 热力图
const HeatMap = (props: HeatMapInfo) => {
  const { type = 0, substationCode, industry } = props;
  const mapDivRef = useRef(null); // 地图容器
  const map = useRef<any>(null); // 地图实例
  const overlayRef = useRef<any>(null); // 弹出框
  const popupRef = useRef<any>(null); // 弹出框容器
  const popupCloserRef = useRef<any>(null); // 弹出框关闭容器
  const popupContentRef = useRef<any>(null); // 弹出框内容容器
  const heatMapLayer = useRef<any>(null); // 热力图层

  const [maxValue, setMaxValue] = useState(0); // 热力图数据最大值
  const [minValue, setMinValue] = useState(0); // 热力图数据最小值

  // 碳排放热力图
  const { run: fecthCarbonHeatMap } = useRequest(getCarbonHeatMap, {
    manual: true,
    onSuccess: (result) => {
      if (result.data && result.data.length > 0) {
        const carbonTotalArray = result.data.map((item: any) => item.carbonTotal);
        setMaxValue(Math.max(...carbonTotalArray));
        setMinValue(Math.min(...carbonTotalArray));

        // 1. 将数据转换为 OpenLayers 支持的格式
        const features = result.data.map((item: any) => {
          // 创建一个矢量要素
          const feature = new Feature({
            geometry: new Point(
              fromLonLat([item.longitude ? item.longitude : 0, item.latitude ? item.latitude : 0]),
            ), // 使用经纬度创建点几何
            name: item?.substationName,
            carbonTotal: item?.carbonTotal,
          });
          return feature;
        });

        // 热力图层
        if (heatMapLayer.current) {
          heatMapLayer.current.getSource().clear();
          heatMapLayer.current.getSource().addFeatures(features);
        } else {
          heatMapLayer.current = new HeatmapLayer({
            source: new VectorSource({
              features: features, // 将要素添加到矢量源中
            }),
            blur: 6, // 模糊程度，可调整
            radius: 8, // 半径，可调整
            weight: function(feature) {
              // 获取点位的权重，这里假设值存储在属性 'value' 中              
              const weight = parseFloat(feature.get('carbonTotal')) / 100 < 0.3 ? 0.3 : parseFloat(feature.get('carbonTotal')) / 90;
              // const weight = feature.get('carbonTotal');
              console.log('Weight value:', weight);
              return weight;
            },
            gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'] // 自定义颜色梯度
          });
          if (map.current) map.current.addLayer(heatMapLayer.current);
        }
      }
    },
  });

  // 请求字段
  const handleParams = () => {
    let params: any = { type };
    // 不同区域类型请求参数不同
    switch (type) {
      case 0:
        break;
      case 1:
        params.substationCode = substationCode;
        break;
      case 2:
        params.industryCode = industry;
        break;
    }
    return params;
  };

  // 初始化弹出框
  const initPopup = (map: any) => {
    // 创建popup
    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: true,
      positioning: 'bottom-center',
      stopEvent: false,
      // autoPanAnimation: {
      //     duration: 250
      // }
    });
    map.addOverlay(overlayRef.current);

    // 关闭popup
    if (popupCloserRef.current) {
      popupCloserRef.current.onclick = () => {
        overlayRef.current.setPosition(undefined);
        popupCloserRef.current?.blur();
        return false;
      };
    }
  };

  // 初始化地图
  const initMap = () => {
    // 创建地图中心点坐标
    const centerCoordinate = fromLonLat([104.300989, 30.607689]);
    // const centerCoordinate = fromLonLat([106.114616, 29.849167]);
    // 定义范围，例如：成都龙泉驿区的范围
    const extent = transformExtent(
      [103.189623, 30.15979, 104.96262, 31.037765],
      'EPSG:4326',
      'EPSG:3857',
    );

    // 初始化视图对象
    const view = new View({
      center: centerCoordinate,
      zoom: 10.5,
      // minZoom: 9,
      minZoom: 5,
      maxZoom: 18,
      // 指定投影
      projection: 'EPSG:3857',
      // extent: extent,
    });

    // 创建高德图层
    const gDLayer = new TileLayer({
      source: new XYZ({
        url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      }),
    });

    // 设置滤镜效果
    gDLayer.on('postrender', function (event: any) {
      const ctx = event.context;
      ctx.filter = 'invert(100%)'; // 设置滤镜效果，例如：'hue', 'saturate', '
      // ctx.save();
      // ctx.globalCompositeOperation = 'hue'; // 设置滤镜效果，例如：'hue', 'saturate', 'grayscale' 等
      // ctx.fillStyle = 'rgba(0, 155, 0, 0.5)'; // 定义滤镜效果的颜色和透明度
      // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // ctx.restore();
    });

    // 创建 GeoJSON 图层
    const geoJSONLayer = new VectorLayer({
      source: new VectorSource({
        url: '/jsonData/510112_full.json',
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000', // 描边红色
          width: 2, // 设置描边宽度为 2 像素
        }),
        fill: new Fill({
          // color: "#ff000020" // 填充红色透明
          color: 'rgba(255, 0, 0, 0)', // 填充红色半透明
        }),
      }),
    });

    // 初始化地图对象
    map.current = new Map({
      target: mapDivRef.current!,
      layers: [gDLayer, geoJSONLayer],
      view: view,
      controls: [],
    });

    // const heatMapData = generateHeatMapData(500);
    initPopup(map.current);

    // 鼠标移入事件
    map.current.on('pointermove', function (evt: any) {
      const coordinate = evt.coordinate;
      overlayRef.current.setPosition(undefined);

      map.current.forEachFeatureAtPixel(evt.pixel, (feature: any, layer: any) => {
        if (layer !== geoJSONLayer) {
          popupContentRef.current.innerHTML = '';
          popupContentRef.current.innerHTML += `<p class=${styles.olPopupContentLable}>企业名称：</p>`;
          popupContentRef.current.innerHTML += `<p class=${styles.olPopupContentValue}>${
            feature.getProperties()?.name
          }</p>`;
          popupContentRef.current.innerHTML += '<br/>';
          popupContentRef.current.innerHTML += `<p class=${styles.olPopupContentLable}>碳排放量：</p>`;
          popupContentRef.current.innerHTML += `<p class=${styles.olPopupContentValue}>${
            feature.getProperties()?.carbonTotal
              ? parseFloat(feature.getProperties()?.carbonTotal).toFixed(2)
              : 0
          }t</p>`;
          // 弹出popup
          overlayRef.current.setPosition(coordinate);
        }
      });
    });
  };

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (heatMapLayer.current) {
      heatMapLayer.current.getSource().clear();
    }
    if (type === 1 && !substationCode) return;
    if (type === 2 && !industry) return;
    fecthCarbonHeatMap(handleParams());
  }, [type, substationCode, industry]);

  return (
    <>
      <p className={styles.mapText}>|</p>
      <p className={styles.mapHead}>碳排放热力图</p>
      <div style={{ width: '100%', height: '100%' }} ref={mapDivRef}></div>
      <div id="popup" className={styles.olPopup} ref={popupRef}>
        <a href="#" id="popup-closer" className={styles.olPopupCloser} ref={popupCloserRef} />
        <div id="popup-content" ref={popupContentRef}></div>
      </div>
      <div className={styles.legend}>
        <div className={styles.legendGradient}></div>
        <div className={styles.legendLabels}>
          <span className={styles.legendLabel}>{minValue.toFixed(2)}</span>
          {/* <span className={styles.legendLabel}>10</span>
    <span className={styles.legendLabel}>20</span> */}
          <span className={styles.legendLabel}>{maxValue.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};
export default HeatMap;
