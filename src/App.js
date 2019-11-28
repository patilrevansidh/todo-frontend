import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { fetchBuckets, fetchingTodos } from './app/views/todolist/action/actions';
// import TodoForm from './app/views/todolist/form';
// import TodoList from './app/views/todolist/list/index';
// import { Routes } from './app/config/routes';
import data from './data.json';
import { getHeader, getTestHeaders, getAggridTestHeader } from './helper';
class App extends React.Component {
  componentDidMount() {
    const { fetchBuckets, fetchingTodos } = this.props;
    fetchBuckets();
    fetchingTodos();
  }

  handleGetRow = () => {
    const headers = getTestHeaders(data.productFamily[0]);
    console.log('Headers', headers)
    const agGridTestHeader = getAggridTestHeader(headers)
    console.log('agGridTestHeader', agGridTestHeader)
  }

  render = () => <div>
    {/* <Routes/> */}
    <div onClick={this.handleGetRow}>
      Get Row
    </div>
  </div>
}

const mapDispatchToProps = (dispatch) => ({
  fetchBuckets: () => {
    dispatch(fetchBuckets());
  },
  fetchingTodos: () => {
    dispatch(fetchingTodos());
  }
});

export default connect(null, mapDispatchToProps)(App);
