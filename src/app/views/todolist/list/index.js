import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Table, Col, Row } from 'antd';
import { TODO_HEADERS } from './tableHeaders.js';
import { getTableData } from './util.js';
import { HeaderButton } from '../../../../common/components/HeaderButton.js';
import { TodoCard } from './TodoCard';
import './list.scss'
import { updateTodo } from '../action/actions.js';
import { CardListView } from './CardListing';
const VIEW = { TABLE: 'table', CARD: 'card' }

const TodoList = ({ todos, history, updateTodoMark }) => {
  const [listView, setListView] = useState(VIEW.TABLE)
  const handleAdd = () => history.push('/todo/add')
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
      {/* <Row>
        <Col md={{ span: 16, offset: 3 }}>
          <Row gutter={8}>
            {Array.isArray(todos) && todos.length > 0 &&
              <div className='todo-card-row'>
                {
                  todos.map(todo => <Col md={{ span: 8 }} sm={{ span: 12 }}>
                    <div className='card-container'>
                      <TodoCard
                        onView={() => history.push({ pathname: `/todo/${todo._id}/view`, state: { isView: true } })}
                        onEdit={() => history.push({ pathname: `/todo/${todo._id}/edit`, state: { isEdit: true } })}
                        onMark={() => { updateTodoMark({ ...todo, isDone: !todo.isDone, bucket: todo.bucketId }) }}
                        todo={todo} />
                    </div>
                  </Col>
                  )
                }

              </div >
              || Array.isArray(todos) && todos.length == 0 && <Col md={{ span: 16 }} sm={{ span: 16 }}> No Todos </Col>
            }
          </Row>
        </Col>
      </Row> */}
      <CardListView todos={todos} history={history} updateTodoMark={updateTodoMark} />
    </>
  );
}

function mapStateToProps(state) {
  let todos = state.todoState.todos || [];
  todos = getTableData(todos)
  return { todos };
}

const mapDispatchToProps = (dispatch) => ({
  updateTodoMark: (payload) => {
    dispatch(updateTodo(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);