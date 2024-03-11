import PropTypes from 'prop-types';
import { Fragment } from 'react';
import styles from './index.less';
require('./iconfont');

interface propType {
  style?: any;
  name: any;
}
/** svg图标显示 */
const IconSymbol = function IconSymbol(props: propType) {
  const { style, name } = props;
  return (
    <Fragment>
      <svg className={styles.icon} aria-hidden="true" style={style}>
        <use xlinkHref={`#${name}`} color="#fff" />
      </svg>
    </Fragment>
  );
};
// 校验参数类型
IconSymbol.propTypes = {
  name: PropTypes.string,
};
// 参数默认值
IconSymbol.defaultProps = {
  name: '',
  className: {
    verticalAlign: -0.15,
    fill: 'currentColor',
    overflow: 'hidden',
  },
};

export default IconSymbol;
