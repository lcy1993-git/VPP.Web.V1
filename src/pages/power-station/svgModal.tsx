import Empty from '@/components/empty';
import Svg from '@/components/svg';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const SvgModal = (props: any) => {
  const { setModalVisible, modalVisible, svgPath } = props;
  const [svgPaths, setSvgPaths] = useState('');
  const [isDownLoadSuccess, setIsDownLoadSuccess] = useState<boolean>(true);

  const downloadSvg = async () => {
    try {
      const response = await fetch(svgPath);
      if (response.ok) {
        const svgData = await response.text();
        // 创建一个临时的URL，用于表示SVG文件
        const svgUrl = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml' }));
        setSvgPaths(svgUrl);
      } else {
        setIsDownLoadSuccess(false);
      }
    } catch (error) {
      setIsDownLoadSuccess(false);
    }
  };

  useEffect(() => {
    if (svgPath && svgPath !== null) {
      downloadSvg();
    }
  }, [svgPath]);

  return (
    <Modal
      footer={null}
      open={modalVisible}
      width={window.innerWidth}
      style={{ top: 0 }}
      bodyStyle={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}
      centered
      title="一次性接线图"
      closeIcon={
        <div style={{ whiteSpace: 'nowrap', fontSize: 24, paddingRight: '25px' }}>返回</div>
      }
      destroyOnClose
      onCancel={() => setModalVisible(false)}
    >
      <div className={styles.modalComtainer}>
        {svgPath && svgPath !== null ? (
          isDownLoadSuccess ? (
            <Svg svgPath={svgPaths} />
          ) : (
            <p
              style={{
                fontSize: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              数据加载失败~~~
            </p>
          )
        ) : (
          <Empty />
        )}
      </div>
    </Modal>
  );
};
export default SvgModal;
