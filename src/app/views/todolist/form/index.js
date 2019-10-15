import React, { Component } from 'react';
import { Button, Select, Input, Form, Checkbox, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { addBucket, addTodo } from '../action/actions';
import { TodoFormItem } from '../../../../common/components/FormItem';
import { HTTPService } from '../../../../common/service/HTTPService';
import { URLS } from '../../../../common/constants/variables';
import { HeaderButton } from '../../../../common/components/HeaderButton';

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
    const { bucket, title, description, isDone } = this.props;
    return {
      bucket: bucket && bucket._id || '', title: title || '',
      description: description || '', search: '', isDone: isDone || false, error: ''
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
      bucket: isBucket || newBucket._id
    }
    return payload;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const payload = await this.getTodoPayload()
    this.props.addTodo(payload)
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
    const isEdit = false;
    const title = false && 'Update Todod' || 'Add Todo';
    return (
      <>
       <HeaderButton title={title} showIcon={false} showButton={true} onClick={this.handleBack} btnTitle={'Back'}/>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <TodoFormItem isRequired={true} label="Bucket">
            <Select
              onSearch={this.handleSearch} mode='default' showSearch
              onBlur={() => this.handleSearch(null)} onChange={this.handleChange} >
              {options}
            </Select>
          </TodoFormItem>
          <TodoFormItem isRequired={true} label="Title">
            <Input name='title'
              onChange={this.handleTextChange}
              placeholder="Enter Todo Tile" />
          </TodoFormItem>
          <TodoFormItem label="Description" isRequired={true}>
            <TextArea rows={4}
              name='description'
              onChange={this.handleTextChange}
              placeholder="Enter Todo Descriptions" />
          </TodoFormItem>
          {isEdit && <TodoFormItem label='Status'>
            <Checkbox name='isDone' onChange={this.handleTextChange}>isDone</Checkbox>
          </TodoFormItem>
          }
          <Form.Item  {...trailing}>
            <Button disabled={isDisabled} type="primary" htmlType="submit">
              Submit
          </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  buckets: state.todoState && state.todoState.buckets || [],
  bucketLoader: state.todoState && state.todoState.bucketLoader,
});

const mapDispatchToProps = (dispatch) => ({
  addBucket: (bucket) => {
    dispatch(addBucket(bucket));
  },
  addTodo: (payload) => {
    dispatch(addTodo(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoForm);