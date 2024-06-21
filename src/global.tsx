import { useIntl } from '@umijs/max';
import { Button, message, notification } from 'antd';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' }));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });

      clearCache();
      window.location.reload();
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.destroy(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  clearCache();
}

/**
 * 解决搜狗浏览器中
 * canvas没有roundRect方法的问题
 * */
(function (global) {
  "use strict";
  if(!global.CanvasRenderingContext2D.prototype.roundRect) {
    global.CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
      let ctx = this;

    let [
      topLeftRadius,
      topRightRadius,
      bottomRightRadius,
      bottomLeftRadius
    ] = [0, 0, 0, 0];
    if(Array.isArray(radius)) {
      if(radius.length === 4) {
        [
          topLeftRadius,
          topRightRadius,
          bottomRightRadius,
          bottomLeftRadius
        ] = radius as any;
      } else {
        return
      }
    } else {
      [
        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        bottomLeftRadius
      ] = [radius, radius, radius, radius] as any;
    }

    if (width < topLeftRadius + topRightRadius || height < bottomLeftRadius + bottomRightRadius) {
         console.error("Cannot draw the rounded rectangle because the specified dimensions are too small for the given radii.");
         return;
     }
       ctx.beginPath();
       ctx.moveTo(x + topLeftRadius, y);
       ctx.lineTo(x + width - topRightRadius, y);
       ctx.quadraticCurveTo(x + width, y, x + width, y + topRightRadius);
       ctx.lineTo(x + width, y + height - bottomRightRadius);
       ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRightRadius, y + height);
       ctx.lineTo(x + bottomLeftRadius, y + height);
       ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeftRadius);
       ctx.lineTo(x, y + topLeftRadius);
       ctx.quadraticCurveTo(x, y, x + topLeftRadius, y);
       ctx.closePath();
    }
  }

})(window);
