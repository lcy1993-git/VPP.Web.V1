import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './index.less'
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImgUploadProps {
  getImageList: Dispatch<SetStateAction<UploadFile[]>>;
  imageList: UploadFile[];
  uploadedImage: any[]; // 已上传图片
}

const ImageUpload: React.FC<ImgUploadProps> = (props) => {
  const { getImageList, imageList, uploadedImage = [] } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // const [urlList, setUrlList] = useState<string[]>([]);

  useEffect(() => {
    if (uploadedImage) {
      setFileList([...uploadedImage]);
      getImageList([...uploadedImage]);
    }
  }, [uploadedImage]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);


    setPreviewTitle('查看图片');
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (fileList.length > newFileList.length) {
      return;
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 10 }}>上传</div>
    </div>
  );

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    getImageList([...imageList, file]);
    return false;
  };

  const removeEvent = (file: any) => {
    const copyList = imageList.filter((ite: UploadFile) => ite.uid !== file.uid);
    getImageList(copyList);
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    name: 'file',
    listType: 'picture-card',
    onChange: handleChange,
    beforeUpload,
    fileList: fileList,
    onPreview: handlePreview,
    onRemove: removeEvent,
  };

  return (
    <>
      <Upload {...uploadProps} fileList={fileList} onPreview={handlePreview}>
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} width={1000} onCancel={handleCancel}>
        <div style={{ width: '100%', height: 600, overflow: 'hidden' }} className={styles.flex_center}>
          <img alt="example" style={{ objectFit: 'cover', maxHeight: 500, maxWidth: '100%' }} src={previewImage} />
        </div>
      </Modal>
    </>
  );
};

export default ImageUpload;
