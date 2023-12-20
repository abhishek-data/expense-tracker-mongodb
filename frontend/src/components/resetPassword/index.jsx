import React from 'react';
import axios from 'axios';
import { Button, Form, Input, Typography, message } from 'antd';
import { API_URL } from '../../utils/config';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [form] = Form.useForm();
    const params = useParams()

    const forgotPasswordHandler = async (values) => {
        try {
            const { password, confirm } = values;

            if (password !== confirm) {
                message.error('Passwords do not match', 2);
                return;
            }

            // Now you can use the payload in your request
            const response = await axios.post(`${API_URL}/password/resetpassword/${params.id}`, { password });
            if (response.status === 200) {
                message.success('Password has been reset sucessfully.', 2);
            }
        } catch (error) {
            message.error(error.message, 2);
        }
    };

    return (
        <div className='loginForm'>
            <Form form={form} onFinish={forgotPasswordHandler}>
                <Typography.Title className='loginTitle'>Reset Password</Typography.Title>
                <Form.Item
                    name='password'
                    rules={[{ required: true, message: 'Please Enter a New Password' }]}
                >
                    <Input.Password placeholder='Enter Your New Password' />
                </Form.Item>
                <Form.Item
                    name='confirm'
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please Confirm Your New Password' },
                        {
                            validator: (_, value) => {
                                if (!value || form.getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match'));
                            },
                        },
                    ]}
                >
                    <Input.Password placeholder='Confirm Your New Password' />
                </Form.Item>
                <Button type='primary' htmlType='submit' block>
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default ResetPassword;
