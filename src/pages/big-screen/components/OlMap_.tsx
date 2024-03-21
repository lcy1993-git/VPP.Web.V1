import { useEffect, useRef } from "react";
import 'ol/ol.css';
import { Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import HeatmapLayer from 'ol/layer/Heatmap';

const OlMap_ = () => {
    const mapRef = useRef(null);

    // 生成指定数量的随机点
const generateRandomPoints = (count:any) => {
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
    return Math.random() * 1; // 随机生成 0 到 1 之间的浮点数
  }

  // 生成热力图数据
const generateHeatMapData = (count:any) => {
    const features:any = [];
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



    useEffect(() => {
        if (!mapRef.current) return;

        const map: any = new Map({
            // 设置目标容器
            target: mapRef.current,
            // 设置图层
            layers: [
                new VectorLayer({
                    source: new VectorSource({
                        url: '/jsonData/510112_full.json',
                        format: new GeoJSON(),
                    }),
                }),
            ],
            // 创建视图
            view: new View({
                // 将经纬度 [经度, 纬度] 转换为 EPSG:3857 坐标系中的坐标
                center: fromLonLat([104.300989, 30.607689]),
                // 设置缩放级别
                zoom: 11,
                // 指定投影
                projection: 'EPSG:3857'
            }),
             // 移除默认的缩放控件
            controls: []
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
        blur: 12, // 模糊程度，可调整
        radius: 10 // 半径，可调整
      })
      map.addLayer(heatMapLayer);

        return () => map.dispose(); // 组件卸载时进行清理
    }, []);

    return <div id="three-map" style={{ width: '100%', height: '100%' }} ref={mapRef}></div>
}
export default OlMap_