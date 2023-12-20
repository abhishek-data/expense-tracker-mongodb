import { Button, Select, Table } from 'antd';
import moment from 'moment';



const ExpenseReport = ({ expenseReportData, previousDonload }) => {



    const columns = [
        {
            title: "Date", dataIndex: 'createdAt', key: 'createdAt',
            render: text => (
                <span>{moment(text).format("YYYY-MM-DD")}</span>
            ),
            width: 200
        },
        { title: "Expense Amount", dataIndex: "expenseAmount", key: "expenseAmount", width: 200 },
        { title: "Description", dataIndex: "description", key: "description", width: 100 },
        { title: "Category", dataIndex: "category", key: "category", width: 100 },
    ]


    const openDonlodFile = (url) => {
        window.open(url, '_blank');
    }
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <Table
                dataSource={expenseReportData}
                columns={columns}
                rowKey='id'
            // pagination={{ pageSize: 3, hideOnSinglePage: true }}
            />
            <Select>
                {previousDonload.map((item, index) => (
                    <Select.Option key={item.id} value={item.url}>
                        <span onClick={() => (openDonlodFile(item.url))}>Report-{index + 1}</span>
                    </Select.Option>
                ))}
            </Select>
        </div >
    );
};

export default ExpenseReport; 