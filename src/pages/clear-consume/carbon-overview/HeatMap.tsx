import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { useEffect, useRef } from "react";
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj';
import HeatmapLayer from 'ol/layer/Heatmap';
import { Extent } from 'ol/interaction';
import { transformExtent } from 'ol/proj';

// 热力图
const HeatMap = () => {

  const mapRef = useRef(null)

  // 生成指定数量的随机点
  const generateRandomPoints = (count: any) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const latitude = 30.5073 + Math.random() * (30.6789 - 30.5073); // 随机生成纬度
      const longitude = 104.1807 + Math.random() * (104.4911 - 104.2707); // 随机生成经度
      points.push([longitude, latitude]);
    }
    return points;
  }

  // 生成随机权重
  const generateRandomWeight = () => {
    return Math.random() * 1 ; // 随机生成 0 到 1 之间的浮点数
  }

  // 生成热力图数据
  const generateHeatMapData = (count: any) => {
    const features: any = [];
    const points = generateRandomPoints(count);
    points.forEach(point => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point
        },
        properties: {
          weight: generateRandomWeight()
        }
      });
    });
    return {
      type: 'FeatureCollection',
      features: features
    };
  }



  const initMap = () => {
    // 创建地图中心点坐标
    const centerCoordinate = fromLonLat([104.300989, 30.607689]);
// 定义范围，例如：成都龙泉驿区的范围
const extent = transformExtent([102.989623, 30.090979, 104.896262, 31.437765], 'EPSG:4326', 'EPSG:3857');


    // 初始化视图对象
    const view = new View({
      center: centerCoordinate,
      zoom: 10.5,
      minZoom:9,
      maxZoom:18,
      // 指定投影
      projection: 'EPSG:3857',
     extent:extent,
    });

    // 创建 ArcGIS World Street Map 图层
    const arcGISLayer = new TileLayer({
      source: new XYZ({
        url: "https://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}"
      })
    });

    // 创建 GeoJSON 图层
    const geoJSONLayer = new VectorLayer({
      source: new VectorSource({
        url: "/jsonData/510112_full.json",
        format: new GeoJSON()
      }),
      style: new Style({
        stroke: new Stroke({
          color: "#ff0000", // 描边红色
          width: 2 // 设置描边宽度为 2 像素
        }),
        fill: new Fill({
          // color: "#ff000020" // 填充红色透明
          color: "rgba(255, 0, 0, 0)" // 填充红色半透明  
        })
      })
    });

   
    // 初始化地图对象
    const map = new Map({
      target: mapRef.current!,
      layers: [arcGISLayer, geoJSONLayer],
      view: view,
      controls: [],
     
    });

    const heatMapData = generateHeatMapData(500);
    // 热力图层
    const heatMapLayer = new HeatmapLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(heatMapData, {
          dataProjection: 'EPSG:4326', // 输入数据的投影（经纬度）
          featureProjection: 'EPSG:3857' // 输出要素的投影（Web Mercator）
        })
      }),
      blur: 15, // 模糊程度，可调整
      radius: 8 // 半径，可调整
    })

   
    map.addLayer(heatMapLayer);

    map.on('click', function(evt:any) {
      map.forEachFeatureAtPixel(evt.pixel, (feature: any, layer: any) =>{
        if(layer !== geoJSONLayer)
        console.log(feature);
      })
  });
  }

  useEffect(() => {
    initMap()
  }, [])


  return <div style={{ width: '100%', height: '100%' }} ref={mapRef}>

  </div>
}
export default HeatMap
