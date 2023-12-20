import React, { useEffect, useState } from 'react';
import { Layout, Button, message, Modal } from 'antd';
import BuyPremium from '../../pages/buyPremium';
import axios from 'axios';
import { API_URL, decodeToken } from '../../utils/config';
import LeaderBoard from '../LeaderBoard';
import ExpenseReport from '../expenseReport';
import { DownCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const AppHeader = ({ setIsLoggin, isloggedIn }) => {
  const [showReport, setShowReport] = useState(false)
  const [ispremiumUser, setIsPremiumUser] = useState(false)
  const [isShowLeaderBoard, setIsLeaderBoard] = useState(false)
  const [LeaderBoardData, setLeaderBoardData] = useState([])
  const [expenseReportData, setExpenseReportData] = useState([])
  const [previousDonload, setPreviousDonload] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const _ispreiumUser = decodeToken(token).ispremiumUser
      setIsPremiumUser(_ispreiumUser)
      if (_ispreiumUser) {
        const getExpenseReport = async () => {
          try {
            const response = await axios.get(`${API_URL}/expense`, { headers: { 'Authorization': token } })
            if (response?.data) {
              setExpenseReportData(response?.data?.expenses)
            }
          } catch (error) {
            message.error(error)
          }
        }
        getExpenseReport()
      }
    }

  }, [isloggedIn, showReport])

  const handleLogout = () => {
    setIsLoggin(false)
    setIsPremiumUser(false)
    localStorage.removeItem('token')
    message.success("You have sucessfully logged out.")
  };

  const showBuyPremium = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/purchage/get-premium`, { headers: { 'Authorization': token } });

      const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
          const res = await axios.post(`${API_URL}/purchage/updatepayment`, {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          }, { headers: { 'Authorization': token } });
          setIsPremiumUser(true)
          message.success("you are a premium user now.");
          localStorage.setItem('token', res.data.token)
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', () => {
        message.error("Payment failed");
      });
    } catch (err) {
      message.error("something went wrong with the payment");
    }
  }

  const showLeaderBoard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/purchage/leaderboard`, { headers: { 'Authorization': token } });
      if (!response) {
        throw new Error("Something went wrong")
      }
      setLeaderBoardData(response?.data?.users)
      setIsLeaderBoard(true)
    } catch (err) {
      message.error("Something went wrong");
    }
  }

  const handleReport = () => {
    setShowReport(true)
  }

  const donloadReport = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/expense/donload`, { headers: { 'Authorization': token } })
      const data = await response.data
      setPreviousDonload(data?.donloads)
      window.open(data.url, '_blank');
    } catch (err) {
      message.error("Something went wrong loading the report")
    }
  }


  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo">Expense Tracker</div>
          {isloggedIn && (ispremiumUser ? <div className="premium-button">You are premium user <Button type="primary" onClick={showLeaderBoard}>
            Show LeaderBoard
          </Button><Button onClick={handleReport}>Report</Button></div> : <Button type="primary" onClick={showBuyPremium}>
            Buy Premium
          </Button>)}
          {isloggedIn && <Button className="logout-button" type="primary" onClick={handleLogout}>
            Logout
          </Button>}
        </Header>
      </Layout>
      {isShowLeaderBoard ?
        <Modal
          title="LeaderBoard"
          open={isShowLeaderBoard}
          onCancel={() => setIsLeaderBoard(false)}
          width={450}
          maskClosable={false}
          footer={null}
        >
          <LeaderBoard data={LeaderBoardData} />
        </Modal>
        : undefined}
      {showReport ?
        <Modal
          title="Expense Report"
          open={showReport}
          onCancel={() => setShowReport(false)}
          width={500}
          maskClosable={false}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={donloadReport}>
                Donload Report
              </Button>
            </div>
          }
        >
          <ExpenseReport expenseReportData={expenseReportData} previousDonload={previousDonload} />
        </Modal>
        : undefined}
    </>
  );
};

export default AppHeader;
