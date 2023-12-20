import React, { useState } from 'react'
import axios from 'axios'
import { Button, Divider, Form, Input, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API_URL } from '../../utils/config';
const Login = ({ setIsLoggin }) => {

  const [haveAccount, setHaveAccount] = useState(false)
  const [havePassword, setHavePassword] = useState(true)

  const loginHandler = async (value) => {
    try {
      if (haveAccount) {
        const response = await axios.post(`${API_URL}/login`, value)
        setIsLoggin(true)
        localStorage.setItem('token', response.data.token)
        message.success(`welcome! ${response.data.message}`, 2)

      } else {
        const response = await axios.post(`${API_URL}/signup`, value)
        setHaveAccount(true)
        message.success(`welcome! ${response.data.message}`, 2)

      }

    } catch (error) {
      message.error(error.message, 2)
    }
  }

  const forgotPasswordHandler = async (value) => {
    try {
      const response = await axios.post(`${API_URL}/password/forgotpassword`, value)
      message.success('A verification email has been sent to your mail', 2)
    } catch (error) {
      message.error(error.message, 2)
    }
  }

  return (
    <div className='loginForm' style={{ width: '40%', display: 'flex', flexDirection: 'column', margin: '16px auto', alignItems: 'center', opacity: 0.9 }}>
      {havePassword ? (
        <Form onFinish={loginHandler}>
          <Typography.Title className='loginTitle'>{haveAccount ? "Login" : "SignUp"}</Typography.Title>
          {!haveAccount && <Form.Item name='fullname' rules={[{ required: true, message: "Please Enter Valid FullName" }]}>
            <Input placeholder='Enter Your FullName' />
          </Form.Item>}
          <Form.Item name='email' rules={[{ required: true, message: "Please Enter Valid Email" }]}>
            <Input placeholder='Enter Your Email' type='email' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: "Please Enter Valid Password" }]}>
            <Input.Password placeholder='Enter Your Password' />
          </Form.Item>
          <Button type='primary' htmlType='submit' block='true'>{haveAccount ? "Login" : "SignUp"}</Button>
          <div className='forgotPassword' onClick={() => setHavePassword(false)}>Forgot Password</div>
          <Divider style={{ borderColor: "blue", borderWidth: "2px" }}>
            <span className='loginText' onClick={() => setHaveAccount(!haveAccount)}>{haveAccount ? "Dont Have Account? SingnUp" : "Already Have Account? Login"}</span>
          </Divider>
        </Form>) :
        (<Form onFinish={forgotPasswordHandler}>
          <Button type='primary' onClick={() => setHavePassword(true)} ><ArrowLeftOutlined /></Button>
          <Typography.Title className='loginTitle'>Forgot Password</Typography.Title>
          <Form.Item name='email' rules={[{ required: true, message: "Please Enter Valid Email" }]}>
            <Input placeholder='Enter Your Email' type='email' />
          </Form.Item>
          <Button type='primary' htmlType='submit' block='true'>Submit</Button>
        </Form>
        )}
    </div>
  )
}

export default Login