import ContentPage from '@/components/content-page'
import CustomCard from '@/components/custom-card'
import { Form, Select } from 'antd'
import styles from './index.less'

const { Option } = Select
const CarbonOvervirw = () => {
  return <div className={styles.carbon}>
    <div className={styles.carbonSearch}>
      <Form
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="分类"
          name="username"
        >
          <Select
            placeholder="请选择区域"
            allowClear
            style={{width: 260}}
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
      </Form>
    </div>
    <CustomCard>
      <div className={styles.headSide}>
        <div className={styles.headSideItem}>
          <div className={styles.itemIcon}></div>
          <div className={styles.itemValue}>
            <dl>
              <dt>1.66</dt>
              <dd>日总碳排(t)</dd>
            </dl>
            <dl>
              <dt>1.66</dt>
              <dd>日同比(%)</dd>
            </dl>
            <dl>
              <dt>1.66</dt>
              <dd>日环比(%)</dd>
            </dl>
          </div>
        </div>
        <div className={`${styles.headSideItem} ${styles.marginLR30}`}></div>
        <div className={styles.headSideItem}></div>
      </div>
    </CustomCard>
  </div>
}
export default CarbonOvervirw
