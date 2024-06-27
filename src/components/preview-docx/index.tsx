import { useEffect, useRef } from 'react';

import JSZip from 'jszip';
import * as docx from "docx-preview";
import styles from './index.less';

const docxOptions = Object.assign(docx.defaultOptions, {
  debug: true,
  experimental: true
})

const PreviewPdf = (props: { docUrl: string }) => {

  const docContainerRef = useRef(null);

  const preprocessTiff = async (blob: Blob) => {
    let zip = await  JSZip.loadAsync(blob);
    const tiffs = zip.file(/[.]tiff?$/);
    if (tiffs.length == 0) return blob;

    for (let f of tiffs) {
        const buffer = await f.async("uint8array");
        // @ts-ignore
        const tiff = new Tiff({ buffer });
        const blob = await new Promise(res => tiff.toCanvas().toBlob((blob: any) => res(blob), "image/png"));
        zip.file(f.name, (blob as any));
    }
    return await zip.generateAsync({ type: "blob" });
  }


  const renderDocx = async (blob: Blob) => {
    if (!blob) return;
    let docxBlob = preprocessTiff(blob);
    const container = docContainerRef.current!;

    if (container) {
      await docx.renderAsync(docxBlob, container as any, null as any, docxOptions)
    }

  }

  const initPreviewDocx = async (docUrl: string) => {
    const resp = await fetch(docUrl);
    const respBlob = await resp.blob();
    renderDocx(respBlob);
  }

  useEffect(() => {
    const {docUrl} = props;
    initPreviewDocx(docUrl)
  }, [])

  return <div className={styles.documentContainer} ref={docContainerRef}></div>
}
export default PreviewPdf
