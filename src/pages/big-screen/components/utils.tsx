export const creat3DPoup = (dom: any,  mapDom: any, data: any, scaleHeight: any, width: any, height: any) => {
    if (!dom || !mapDom) return;
  
    if (dom.style.display === 'block') return;
  
    dom.style.display = 'block';
    dom.style.position = 'absolute';
    dom.style.top = height - 5 + 'px';
    dom.style.left = width - 5 + 'px';
    const style = `
      <style>
      .box-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: moveUpDown 3s infinite;
  
          .title {
            font-family: Source Han Sans CN, Source Han Sans CN;
            font-weight: bold;
            color: #fff;
          }
  
          .label-text {
            font-family: Source Han Sans CN, Source Han Sans CN;
            color: #ccddff;
            font-size: 18px;
  
            .label-value-green {
              color: #5cdd2e;
              font-weight: bold;
            }
  
            .label-value-red {
              color: #ff4a4a;
              font-weight: bold;
            }
          }
  
          .tip-green {
            width: auto;
            height: auto;
            padding: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: rgba(22, 29, 38, 0.5);
            opacity: 0.9;
            border: 1px solid #329550;
            box-shadow: inset 0px 0px 15px 0px #329550;
          }
  
          .tip-red {
            width: 80px;
            height: 40px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: rgba(22, 29, 38, 0.5);
            opacity: 0.9;
            border: 1px solid #882c2c;
            box-shadow: inset 0px 0px 15px 0px #882c2c;
          }
  
          .line-green {
            width: 1px;
            height: 35px;
            background: linear-gradient(to bottom, rgba(28, 107, 51, 0.3), rgb(20, 195, 93), rgba(1, 165, 75, 0.89));
          }
  
          .line-red {
            width: 1px;
            height: 35px;
            background: linear-gradient(to bottom, rgba(123, 44, 28, 0.3), rgba(255, 82, 82, 1), rgba(255, 48, 48, 0.89));
          }
        }
      </style>
      `;
    let text = '';
    text += `
          <div class="title" style="color: #87CEEB; font-weight: bold; font-size: 20px;">${data.substationName
        }</div>
          <div class="label-text">
              <span style="color: #2AFE97">负荷容量 :</span>
              <span class="mr5" class='label-value-green'}>
        ${(parseFloat(data.loadCapacity) / 1000).toFixed(2)}MW
              </span>
  
          </div>
          <div class="label-text">
              <span style="color: #2AFE97">最小负荷 :</span>
              <span class="mr5" class='label-value-green'}>
        ${data.minimumLoad}
              </span>
          </div>
          <div class="label-text">
          <span style="color: #2AFE97">最大负荷 :</span>
              <span class="mr5" class='label-value-green'}>
        ${data.peakLoad}
              </span>
          </div>
     <br>`;

    dom.innerHTML = `
      ${style}
  
    <div class="box-container">
    <div class='tip-green'} >
    ${text}
    </div>
    </div>
    <div style="position: absolute;left: 0;top: 0;width: 10px;height: 10px;border-top: 2px solid #26DDFD;border-left: 2px solid #26DDFD;"></div>
    <div style="position: absolute;left: 0;bottom: 0;width: 10px;height: 10px;border-bottom: 2px solid #26DDFD;border-left: 2px solid #26DDFD;"></div>
    <div style="position: absolute;right: 0;top: 0;width: 10px;height: 10px;border-top: 2px solid #26DDFD;border-right: 2px solid #26DDFD;"></div>
    <div style="position: absolute;right: 0;bottom: 0;width: 10px;height: 10px;border-bottom: 2px solid #26DDFD;border-right: 2px solid #26DDFD;"></div>
            `;
    dom.blur();
  
    if (
      parseInt(dom.style.top.replace('px', '')) + dom.offsetHeight - 150 * scaleHeight >
      mapDom.offsetHeight
    ) {
      dom.style.top =
        parseInt(dom.style.top.replace('px', '')) -
        (parseInt(dom.style.top.replace('px', '')) +
          dom.offsetHeight -
          150 * scaleHeight -
          mapDom.offsetHeight) +
        'px';
      // console.log(parseInt(dom.style.top.replace('px', '')), 1);
      // console.log(dom.offsetHeight, 2);
      // console.log(mapDom.offsetHeight, 3);
      // console.log(111);
    }
  
    // document.body.appendChild(div);
  };
  
  export const closePoup = (dom: any) => {
    if (dom) {
      dom.style.display = 'none';
    }
  };