import { Card, Checkbox, Icon, Skeleton, Tooltip } from 'antd';
import React from 'react';
import { TOOLTIP_MSG } from '../../../../common/constants/variables';
const { Meta } = Card;

export const TodoCard = ({ loading, todo, onMark, onEdit, onView }) => {
  const { title, description } = todo;
  return <Card style={{ width: '100%' }}
    actions={[
      <Checkbox onMark={() => onMark(todo)}>isDone</Checkbox>,
      <Tooltip title={TOOLTIP_MSG.EDIT}>
        <Icon onClick={() => onEdit(todo)} type="edit" key="edit" />
      </Tooltip>,
      <Tooltip title={TOOLTIP_MSG.VIEW}>
        <Icon onClick={() => onView(todo)} type="eye" key="ellipsis" />
      </Tooltip>
    ]}
  >
    <Skeleton loading={loading} active>
      <Meta title={title} description={description} />
    </Skeleton>
  </Card>
};