import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { fetchBuckets, fetchingTodos } from './app/views/todolist/action/actions';
// import TodoForm from './app/views/todolist/form';
// import TodoList from './app/views/todolist/list/index';
// import { Routes } from './app/config/routes';
import data from './exception.json';
import { getAggridTestHeader, getExceptionRows, getTestHeaders } from './newHeaderHelper';
import { getRowsData } from './headerHelper';
class App extends React.Component {
  componentDidMount() {
    const { fetchBuckets, fetchingTodos } = this.props;
    fetchBuckets();
    fetchingTodos();
  }

  handleGetRow = () => {
    const headers = getRowsData(data.productExceptions);
    console.log('Row Data', headers)
    // const agGridTestHeader = getAggridTestHeader(headers)
    // console.log('agGridTestHeader', agGridTestHeader)
    // const rowData = getExceptionRows(data.productFamily)
    // console.log(' && row Data (&*', rowData)
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
