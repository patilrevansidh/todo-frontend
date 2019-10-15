import React from 'react';
import { Button, Row, Col } from 'antd';

export const HeaderButton = ({ title, showIcon, icon, showButton, onClick, btnTitle }) => <Row className='page-header'>
  <Col md={{ span: 5, offset:3 }}>
    <div className='title'>
      <h1> {title} </h1>
    </div>
  </Col>
  <Col md={{ span: 2, offset: 11 }}>
    {
      showButton && <Button onClick={onClick} type="primary" className='header-button' icon={showIcon && icon} size={'large'} >{btnTitle && btnTitle}</Button>
    }
  </Col>
</Row>;