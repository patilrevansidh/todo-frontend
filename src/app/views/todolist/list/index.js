import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Col, Row } from 'antd';
import { TODO_HEADERS } from './tableHeaders.js';
import { getTableData } from './util.js';
import { HeaderButton } from '../../../../common/components/HeaderButton.js';
import { TodoCard } from './TodoCard';
import './list.scss'

const TodoList = (props) => {
  const handleAdd = () => props.history.push('/todo/add')
  return (
    <>
      <HeaderButton title={'Todos List'}
        showIcon={true} icon={'plus'}
        showButton={true} onClick={handleAdd} />
      {/* <Row >
        <Col md={{ span: 16, offset: 3 }}> */}
      {/* <Table dataSource={this.props.todos} columns={TODO_HEADERS} /> */}
      {/* </Col>
      </Row > */}
      <Row>
        <Col md={{ span: 16, offset: 3 }}>
          <Row gutter={8}>
            <div className='todo-card-row'>
              {
                props.todos.map(item => <Col md={{ span: 8 }} sm={{ span: 12 }}>
                  <div className='card-container'> <TodoCard todo={item} /> </div>
                </Col>
                )
              }
            </div >
          </Row>
        </Col>
      </Row>
    </>
  );
}

function mapStateToProps(state) {
  let todos = state.todoState.todos || [];
  todos = getTableData(todos)
  return { todos };
}

export default connect(mapStateToProps)(TodoList);