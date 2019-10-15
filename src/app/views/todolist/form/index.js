import { Button, Checkbox, Form, Input, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TodoFormItem } from '../../../../common/components/FormItem';
import { HeaderButton } from '../../../../common/components/HeaderButton';
import { FORM_TITLE, URLS, BUTTON_TITLE } from '../../../../common/constants/variables';
import { HTTPService } from '../../../../common/service/HTTPService';
import { addBucket, addTodo, updateTodo } from '../action/actions';

const { TextArea } = Input;
const { Option } = Select;

const trailing = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 5 },
  },
};

class TodoForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  getState = () => {
    return {
      bucket: '', title: '', description: '', search: '', isDone: false, error: ''
    }
  }

  componentDidMount() {
    this.handleUpdateState()
  }

  handleUpdateState() {
    const { selectedTodo } = this.props;
    if (!selectedTodo) return;
    let { title, bucket, description, isDone } = selectedTodo;
    bucket = bucket && bucket._id
    this.setState({ bucket, title, description, isDone: isDone || false });
  }

  componentDidUpdate(prevProps) {
    const { selectedTodo } = this.props;
    if (!selectedTodo) return;
    if ((prevProps.selectedTodo === null && selectedTodo) || (prevProps.selectedTodo && prevProps.selectedTodo._id !== selectedTodo._id)) {
      this.handleUpdateState()
    }
  }

  handleChange = (bucket) => this.setState({ bucket });

  handleSearch = (search) => this.setState({ search });

  addNewBucket = async (title) => {
    try {
      const response = await HTTPService.post(URLS.BUCKET, { title })
      this.props.addBucket(response.data)
      return response.data;
    } catch (error) {
      this.setState({ error });
    }
  }

  getTodoPayload = async () => {
    const isBucket = this.props.buckets.find(bucket => bucket._id === this.state.bucket);
    let newBucket = ''
    if (!isBucket) {
      newBucket = await this.addNewBucket(this.state.bucket);
    }
    const payload = {
      title: this.state.title, description: this.state.description,
      bucket: isBucket && isBucket._id || newBucket._id
    }
    if (this.props.isEdit || this.props.selectedTodo) {
      payload.isDone = this.state.isDone;
      payload._id = this.props.selectedTodo._id
    }
    return payload;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { history } = this.props;
    const payload = await this.getTodoPayload()
    if (payload._id) {
      this.props.updateTodo(payload,history); return;
    }
    this.props.addTodo(payload, history)
  }

  getOptions = () => {
    let options = [];
    const { buckets } = this.props;
    const { search } = this.state;
    options = buckets.map(item => <Option key={item._id} value={item._id}>{item.title}</Option>);
    if (search) {
      const newOptions = <Option value={search}>{search}</Option>
      options.push(newOptions)
    }
    return { options }
  }

  isValid = () => {
    const { bucket, title, description } = this.state;
    return !bucket || !title || !description;
  }

  handleTextChange = ({ target: { name, value, checked } }) => {

    if (name === 'isDone') {
      this.setState({ [name]: checked });
      return;
    }
    this.setState({ [name]: value });
  }

  handleBack = () => this.props.history.goBack()

  render() {
    const { options } = this.getOptions()
    const isDisabled = this.isValid();
    const { isView, isEdit } = this.props;
    const title = isEdit && FORM_TITLE.EDIT || isView && FORM_TITLE.VIEW || FORM_TITLE.ADD;
    return (
      <>
        <HeaderButton title={title} showIcon={false} showButton={true} onClick={this.handleBack} btnTitle={'Back'} />
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <TodoFormItem isRequired={true} label="Bucket">
            <Select
              disabled={isView} value={this.state.bucket}
              onSearch={this.handleSearch} mode='default' showSearch
              onBlur={() => this.handleSearch(null)} onChange={this.handleChange} >
              {options}
            </Select>
          </TodoFormItem>
          <TodoFormItem isRequired={true} label="Title">
            <Input name='title' disabled={isView} value={this.state.title}
              onChange={this.handleTextChange}
              placeholder="Enter Todo Tile" />
          </TodoFormItem>
          <TodoFormItem label="Description" isRequired={true}>
            <TextArea rows={4} disabled={isView} value={this.state.description}
              name='description' disabled={isView}
              onChange={this.handleTextChange}
              placeholder="Enter Todo Descriptions" />
          </TodoFormItem>
          {isEdit && <TodoFormItem label='Status'>
            <Checkbox name='isDone' checked={this.state.isDone} onChange={this.handleTextChange}>isDone</Checkbox>
          </TodoFormItem>
          }
          {
            !isView && <Form.Item  {...trailing}>
              <Button disabled={isDisabled} type="primary" htmlType="submit">
                {isEdit && BUTTON_TITLE.UPDATE || BUTTON_TITLE.SUBMIT}
              </Button>
            </Form.Item>
          }
        </Form>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const todosId = ownProps.match.params ? ownProps.match.params.id : null;
  const todos = state.todoState && state.todoState.todos || [];
  const buckets = state.todoState && state.todoState.buckets || [];
  const isEdit = todosId && ownProps.match.path === "/todo/:id/edit" && true || false;
  const isView = todosId && ownProps.match.path === "/todo/:id/view" && true || false;
  return {
    buckets,
    bucketLoader: state.todoState && state.todoState.bucketLoader,
    selectedTodo: todosId && todos.find(todo => todo._id == todosId) || null,
    isEdit, isView,
  }
};

const mapDispatchToProps = (dispatch) => ({
  addBucket: (bucket) => {
    dispatch(addBucket(bucket));
  },
  addTodo: (payload, history) => {
    dispatch(addTodo(payload, history));
  },
  updateTodo: (payload, history) => {
    dispatch(updateTodo(payload,history));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoForm);