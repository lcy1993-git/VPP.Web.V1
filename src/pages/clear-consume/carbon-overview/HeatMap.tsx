import { View, Overlay, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { useEffect, useRef, useState } from "react";
import Map from 'ol/Map'
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { Point } from 'ol/geom';
import HeatmapLayer from 'ol/layer/Heatmap';
import styles from './index.less'
import { useRequest } from "ahooks";
import { getCarbonHeatMap } from "@/services/carbon-overview";

// 热力图
const HeatMap = () => {
  const mapDivRef = useRef(null); // 地图容器
  const map = useRef<any>(null); // 地图实例
  const overlayRef = useRef<any>(null);
  const popupRef = useRef<any>(null);
  const popupCloserRef = useRef<any>(null);
  const popupContentRef = useRef<any>(null);

  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);

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
        const heatMapLayer = new HeatmapLayer({
          source: new VectorSource({
            features: features, // 将要素添加到矢量源中
          }),
          blur: 15, // 模糊程度，可调整
          radius: 8, // 半径，可调整
        });
        if (map.current) map.current.addLayer(heatMapLayer);
      }
    },
  });

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
      minZoom: 9,
      maxZoom: 18,
      // 指定投影
      projection: 'EPSG:3857',
      extent: extent,
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
              ? feature.getProperties()?.carbonTotal.toFixed(2)
              : 0
          }t</p>`;
          // 弹出popup
          overlayRef.current.setPosition(coordinate);
        }
      });
    });
  };

  useEffect(() => {
    fecthCarbonHeatMap();
    initMap();
  }, []);

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
