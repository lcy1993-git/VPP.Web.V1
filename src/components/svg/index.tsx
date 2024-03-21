import { getSvgMeasurements } from '@/services/energy-station';
import { useEffect, useRef, useState } from 'react';
import svgPanZoom from 'svg-pan-zoom';
import styles from './index.less';

const Svg = (props: any) => {
  const { openModal, svgPath } = props;
  const svgWrapRef = useRef(null);
  // Svg Element
  const svgDocument = useRef<any>(null);
  // 所有量测量
  const measures = useRef<any>({});
  // 所有图形对象  Meas_Ref的ObjectID和图元ID对应关系
  const objects = useRef<any>({});
  // 计时器
  const meanInterval = useRef<any>(null);
  const objectInterval = useRef<any>(null);

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  // 获取第一个子元素
  const getFirstChild = (node: { firstChild: any }) => {
    let x = node.firstChild;
    while (x && x.nodeType !== 1) {
      x = x.nextSibling;
    }
    return x;
  };

  // 需要继续详细扫描返回0，否则返回-1
  const procGetObject = (child: any, parent: any) => {
    let findPSR = false;
    let findMeas = false;
    const measObjectIDs: any[] = [];
    if (child.tagName === 'metadata') {
      const x = child.childNodes;
      for (let i = 0; i < x.length; i += 1) {
        if (x[i].nodeName === 'cge:PSR_Ref') {
          findPSR = true;
        } else if (x[i].nodeName === 'cge:Meas_Ref') {
          if (x[i].getAttribute('ObjectID').split(' ')[0] !== 'analog') {
            findPSR = true;
          }
          findMeas = true;
          measObjectIDs.push(x[i].getAttribute('ObjectID'));
        }
      }

      for (let j = 0; j < measObjectIDs.length; j += 1) {
        if (findMeas && !findPSR) {
          if (
            measures.current[measObjectIDs[j]] === null ||
            measures.current[measObjectIDs[j]] === undefined
          ) {
            measures.current[measObjectIDs[j]] = [];
          }
          measures.current[measObjectIDs[j]].push(parent.getAttribute('id'));
        }
        if (findMeas && findPSR) {
          if (
            objects.current[measObjectIDs[j]] === null ||
            objects.current[measObjectIDs[j]] === undefined
          ) {
            objects.current[measObjectIDs[j]] = [];
          }
          objects.current[measObjectIDs[j]].push(parent.getAttribute('id'));
        }
      }
    }
  };

  // 遍历所有子节点
  const getChildNodes = (parent: any, procfunc: any) => {
    let child = getFirstChild(parent);
    if (child !== null) {
      if (!procfunc(child, parent)) {
        getChildNodes(child, procfunc);
      }

      while (child.nextElementSibling !== null) {
        child = child.nextElementSibling;
        if (!procfunc(child, parent)) {
          getChildNodes(child, procfunc);
        }
      }
    }
  };
  // 修改节点数据
  const modifyData = (id: any, data: any) => {
    const dataElement = svgDocument.current.getElementById(id);
    if (dataElement) {
      const textNode = getFirstChild(dataElement);
      // 修改文本字体颜色
      // if (textNode && !rdb) {
      //   textNode.style.fill = 'gray'
      // }
      if (textNode.firstChild === null) {
        textNode.textContent = isNaN(data) ? data : data.toFixed(2) - 0;
      } else {
        textNode.firstChild.textContent = isNaN(data) ? data : data.toFixed(2) - 0;
      }
    }
  };
  // 从服务器获取新的节点
  const getMeasurement = (measurementData: any, measurementIds: any) => {
    if (getSvgMeasurements) {
      const ids = measurementData.map((item: any) => item.measurementId);
      getSvgMeasurements(ids).then((values: any) => {
        for (let i = 0; i < values.length; i += 1) {
          if (!(values[i].inValid || values[i].inValid === null)) {
            const mm = measures.current[measurementIds[values[i].measurementId]];
            for (let m = 0; m < mm.length; m += 1) {
              modifyData(mm[m], values[i].data);
            }
          }
        }
      });
    }
  };

  const getIdAndDataMap = (obj: any) => {
    const ids: any = {};
    const arrays: any = [];
    for (const o in obj) {
      if (obj.hasOwnProperty(o)) {
        const item: any = {};
        const split = o.split(' ');
        ids[split[1]] = o;
        item.measurementId = split[1].replace(/(^\s*)|(\s*$)/g, '');
        item.key = split[1].replace(/(^\s*)|(\s*$)/g, '');
        item.rdb = true;
        arrays.push(item);
      }
    }
    return { id: ids, data: arrays };
  };

  /**
   *
  const modifyStatus = (id: any, data: any) => {
    const dataElement = svgDocument.current.getElementById(id);
    if (dataElement) {
      const useNode = getFirstChild(dataElement);
      const status = useNode.getAttribute('xlink:href');
      if (status !== null) {
        const pre = status.split('@');
        useNode.setAttribute('xlink:href', `${pre[0]}@${data}`);
      }
    }
  };

  const getObjects = (objectData: any, objectIds: { [x: string]: string | number; }) => {
    if (getSvgMeasurements) {
      getSvgMeasurements(objectData).then((values: string | any[]) => {
        for (let i = 0; i < values.length; i += 1) {
          if (!(values[i].invalid || values[i].invalid === null)) {
            const oo = objects.current[objectIds[values[i].key]];
            for (let o = 0; o < oo.length; o += 1) {
              modifyStatus(oo[o], values[i].data);
            }
          }
        }
      });
    }
  };

  const updateObjects = (param: any, obj: any) => {
    getObjects(obj.data, obj.id);
    clearInterval(objectInterval.current);
    objectInterval.current = setInterval(() => {
      getObjects(obj.data, obj.id);
    }, param);
  };
  */

  const updateMeasurement = (param: any, obj: any) => {
    getMeasurement(obj.data, obj.id);
    clearInterval(meanInterval.current);
    meanInterval.current = setInterval(() => {
      getMeasurement(obj.data, obj.id);
    }, param);
  };

  const ajaxStart = () => {
    updateMeasurement(10000, getIdAndDataMap(measures.current));
    // updateObjects(10000, getIdAndDataMap(objects.current));
  };

  /**
   * 点击通信状态打开弹框
   */
  const clickCommunicationStatus = () => {
    // const { openModal } = this.props;
    // @ts-ignore
    const embed = svgWrapRef.current?.childNodes[0];
    const metadata = embed.getSVGDocument().getElementsByTagName('metadata');
    if (metadata && metadata.length > 0) {
      for (let i = 0; i < metadata.length; i += 1) {
        const PSRRef = metadata[i].getElementsByTagName('cge:Meas_Ref');

        if (PSRRef && PSRRef.length > 0) {
          metadata[i].parentNode.style.cursor = 'pointer';
          metadata[i].parentNode.addEventListener('click', () => {
            const pcsId = PSRRef[0].attributes.ObjectID.nodeValue;

            if (openModal) {
              // 打开弹框
              openModal(pcsId);
            }
          });
        }
      }
    }
  };

  /**
   *
   * 获取 a 标签的路径
   * @memberof Svg
   */
  // const getUrlSvg = () => {
  //   // @ts-ignore
  //   const embed = svgWrapRef.current?.childNodes[0];
  //   const kv = embed.getSVGDocument().getElementsByTagName('a');
  //   if (kv) {
  //     for (let i = 0; i < kv.length; i += 1) {
  //       kv[i].style.cursor = 'pointer';
  //       kv[i].addEventListener('click', () => {
  //         if (getUrlJudge) {
  //           getUrlJudge(kv[i].href.baseVal);
  //         }
  //       });
  //     }
  //   }
  // };

  const initLoadSvg = () => {
    // @ts-ignore
    if (
      !document.getElementById('svgElement') ||
      !document.getElementById('svgElement')?.getSVGDocument()
    ) {
      return;
    }

    // @ts-ignore
    svgDocument.current = document.getElementById('svgElement')?.getSVGDocument();

    // SVG增加缩放控件  初始化缩放控件
    const zoomControl = svgPanZoom(`#svgElement`, {
      zoomEnabled: true, // svg允许缩放
      panEnabled: true, // // svg允许拖拽
      controlIconsEnabled: false, // 控制面板显示
      dblClickZoomEnabled: false, //  控制盘，默认不显示，目前滚轮缩放，支持拖拽，双击适屏
      zoomScaleSensitivity: 0.6, // 缩放程度
      fit: true, // 适屏
      center: true,
      maxZoom: 5, // 最小缩小比例
      minZoom: 0.5, // 最大放大比例
    });

    // 双击自动适屏
    svgDocument.current.addEventListener('dblclick', (e: { preventDefault: () => void }) => {
      e.preventDefault();
      zoomControl.fit();
      zoomControl.center();
    });

    getChildNodes(getFirstChild(svgDocument.current), procGetObject);

    ajaxStart();

    clickCommunicationStatus();

    // getUrlSvg()
  };

  useEffect(() => {
    if (svgWrapRef.current) {
      // @ts-ignore
      setSvgWidth(svgWrapRef.current.offsetWidth);
      // @ts-ignore
      setSvgHeight(svgWrapRef.current.offsetHeight);
    }

    return () => {
      clearInterval(objectInterval.current);
      clearInterval(meanInterval.current);
    };
  }, []);

  return (
    <div className={styles.svgWrap} ref={svgWrapRef}>
      <embed
        id="svgElement"
        type="image/svg+xml"
        width={svgWidth}
        height={svgHeight}
        src={svgPath}
        // eslint-disable-next-line react/no-unknown-property
        onLoad={initLoadSvg}
      />
    </div>
  );
};

export default Svg;
