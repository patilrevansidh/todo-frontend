import React from 'react';
import { Table, Col, Row } from 'antd';
import { TodoCard } from './TodoCard';

export const CardListView = ({ todos, history, updateTodoMark }) => <Row>
  <Col md={{ span: 16, offset: 3 }}>
    <Row gutter={8}>
      {Array.isArray(todos) &&
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
      }
    </Row>
  </Col>
</Row>