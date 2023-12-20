import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Select, Table, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../utils/config';

const { Option } = Select



const AddExpense = () => {
    const [expenseList, setExpenseList] = useState([])
    const [expenseFlag, setExpenseFlag] = useState(true)
    const [token, setToken] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const getExpense = async () => {
            const token = localStorage.getItem('token')
            setToken(token)
            try {
                const response = await axios.get(`${API_URL}/expense?page=${currentPage}&limit=${limit}`, { headers: { 'Authorization': token } })
                if (response?.data) {
                    setExpenseList(response.data.expenses)
                    setTotalPages(response.data.totalPages)
                }
            } catch (error) {
                message.error(error)
            }
        }
        getExpense()
    }, [expenseFlag, currentPage, limit])

    const columns = [
        { title: "Expense Amount", dataIndex: "expenseAmount", key: "expenseAmount" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Category", dataIndex: "category", key: "category" },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id) => (
                <span>
                    {/* <Button type='primary' icon={<EditOutlined />} onClick={() => onEdit(id)} /> */}
                    <Button type='danger' icon={<DeleteOutlined />} onClick={() => onDelete(id)} />
                </span>
            )
        }
    ]

    const onDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/expense/delete-expense/${id}`, { headers: { 'Authorization': token } })
            if (response?.data) {
                message.success(response.data.message)
                setExpenseFlag(prev => !prev)
            }
        } catch (error) {
            message.error(error)
        }
    }
    // const onEdit = async (id) => {
    //     try {
    //         const response = await axios.put(`${API_URL}/expense/update-expense/${id}`, { headers: { 'Authorization': token } })
    //         if (response?.data) {
    //             message.success(response.data.message)
    //             setExpenseFlag(prev => !prev)
    //         }
    //     } catch (error) {
    //         message.error(error)
    //     }
    // }

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${API_URL}/expense/add-expense`, values, { headers: { 'Authorization': token } })
            if (response?.data) {
                message.success(response.data.message)
                setExpenseFlag(prev => !prev)
            }
        } catch (error) {
            message.error(error)
        }
    }

    return (
        <>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', margin: '16px auto', alignItems: 'center', opacity: 0.9 }}>
                <Card title="Add Expense" style={{ width: '100%' }}>
                    <Form onFinish={onFinish} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Form.Item label="Expense Amount" name="expenseAmount" style={{ marginBottom: '8px' }} rules={[{ required: true, message: 'Please input your Expense Amount' }]}>
                            <InputNumber size="default" />
                        </Form.Item>
                        <Form.Item label="Description" name="description" style={{ marginBottom: '8px' }} rules={[{ required: true, message: 'Please input your description' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            name="category"
                            style={{ marginBottom: '8px' }}
                            rules={[{ required: true, message: 'Please select your category' }]}
                        >
                            <Select>
                                <Option value="food">Food</Option>
                                <Option value="petrol">Petrol</Option>
                                <Option value="shopping">Shopping</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '8px' }}>
                            <Button type="primary" htmlType="submit">
                                Add
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

            <div style={{ width: '50%', margin: '16px auto', display: 'flex', justifyContent: 'center', opacity: 0.9 }}>

                <Table
                    dataSource={expenseList}
                    columns={columns}
                    style={{ width: '100%' }}
                    rowKey='id'
                    pagination={false}
                    footer={() => (
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center' }}>
                            <Button disabled={currentPage === 1 ? true : false} onClick={() => setCurrentPage(prev => prev - 1)}><StepBackwardOutlined /></Button>
                            <Select onChange={value => setLimit(value)} defaultValue={5}>
                                <Select.Option value={5}>5</Select.Option>
                                <Select.Option value={10}>10</Select.Option>
                                <Select.Option value={15}>15</Select.Option>
                            </Select>
                            <Button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage >= totalPages} ><StepForwardOutlined /></Button>
                        </div>
                    )}
                />
            </div>
        </>

    );
};

export default AddExpense; 