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

// 热力图
const HeatMap = () => {

  const mapRef = useRef(null)

  const initMap = () => {
    // 创建地图中心点坐标
    const centerCoordinate = [104.269181,30.56065];

    // 初始化视图对象
    const view = new View({
      center: centerCoordinate,
      zoom: 15
    });

    // 创建 ArcGIS World Street Map 图层
    const arcGISLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
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
          color: "#ff000020" // 填充红色透明
        })
      })
    });

    // 初始化地图对象
    new Map({
      target: mapRef.current,
      layers: [arcGISLayer, geoJSONLayer],
      view: view
    });
  }

  useEffect(() => {
    initMap()
  }, [])


  return <div style={{width: '100%', height: '100%'}} ref={mapRef}>

  </div>
}
export default HeatMap
