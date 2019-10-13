import React from 'react';
import { Form } from 'antd';

export const TodoFormItem = ({ label, children, isRequired }) => <Form.Item
  label={
    <span className={isRequired && 'ant-form-item-required' || 'ant-form-item-label' }>
      {label}&nbsp;
    </span>
  }
>
  {children}
</Form.Item>