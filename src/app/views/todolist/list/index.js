import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Col, Row } from 'antd';
import { TODO_HEADERS } from './tableHeaders.js';
import { getTableData } from './util.js';

class TodoList extends Component {
  render() {    
    return (
      <Row >
        <Col md={{ span: 16, offset: 5 }}>
          <Table  dataSource={this.props.todos} columns={TODO_HEADERS} />
        </Col>
      </Row >
    );
  }
}

function mapStateToProps(state) {
  let todos = state.todoState.todos || [];
  todos = getTableData(todos)
  return { todos };
}

export default connect(mapStateToProps)(TodoList);