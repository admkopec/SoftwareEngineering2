import { ReportHandler } from 'web-vitals';
import { IS_DEV } from './resources/constants';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
        return true;
      })
      .catch((error) => IS_DEV && console.log(error));
  }
};

export default reportWebVitals;
