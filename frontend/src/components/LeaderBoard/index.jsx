import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Select, Table, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../utils/config';

const { Option } = Select



const LeaderBoard = ({ data }) => {


    const columns = [
        {
            title: 'Serial No',
            dataIndex: 'serialNo',
            key: 'serialNo',
            render: (text, record, index) => index + 1
        },
        // { title: "User", dataIndex: ['User', 'fullname'], key: "User.fullname" },
        { title: "User", dataIndex: 'fullname', key: 'fullname' },
        { title: "Total Expense", dataIndex: "totalExpenses", key: "totalExpenses" },
    ]



    return (
        <div style={{ width: 400, height: '100%', overflow: 'auto' }}>
            <Table dataSource={data} columns={columns} style={{ width: 400 }} rowKey='id' pagination={{ pageSize: 3, hideOnSinglePage: true }} />

        </div>
    );
};

export default LeaderBoard; 