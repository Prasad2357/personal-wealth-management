// import React, { useEffect, useState } from "react";
// import { Card, Row, Button } from "antd";
// import NewsFeed from "./NewsFeed/NewsFeed"; // Import NewsFeed component
// import Cards from "./Cards";
// import AddExpenseModal from "./Modals/AddExpense";
// import AddIncomeModal from "./Modals/AddIncome";
// import Loader from "./Loader";
// import Header from "./Header";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../firebase";
// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { toast } from "react-toastify";

// const Dashboard = () => {
//   const [user] = useAuthState(auth);
//   const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
//   const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentBalance, setCurrentBalance] = useState(0);
//   const [income, setIncome] = useState(0);
//   const [expenses, setExpenses] = useState(0);
//   const [isNewsVisible, setIsNewsVisible] = useState(false);

//   useEffect(() => {
//     if (user) fetchTransactions();
//   }, [user]);

//   useEffect(() => {
//     calculateBalance();
//   }, [transactions]);

//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const transactionsRef = collection(db, "users", user.uid, "transactions");
//       const snapshot = await getDocs(transactionsRef);
//       const fetchedTransactions = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTransactions(fetchedTransactions);
//     } catch (error) {
//       toast.error("Error fetching transactions: " + error.message);
//     }
//     setLoading(false);
//   };

//   const showExpenseModal = () => setIsExpenseModalVisible(true);
//   const showIncomeModal = () => setIsIncomeModalVisible(true);
//   const handleExpenseCancel = () => setIsExpenseModalVisible(false);
//   const handleIncomeCancel = () => setIsIncomeModalVisible(false);

//   const onFinish = async (values, type) => {
//     const transaction = { ...values, type, createdAt: new Date() };
//     setLoading(true);
//     try {
//       await addDoc(
//         collection(db, "users", user.uid, "transactions"),
//         transaction
//       );
//       setTransactions([...transactions, transaction]);
//       toast.success("Transaction added successfully!");
//     } catch (error) {
//       toast.error("Error adding transaction: " + error.message);
//     }
//     setLoading(false);
//   };

//   const calculateBalance = () => {
//     let incomeTotal = 0;
//     let expensesTotal = 0;
//     transactions.forEach((transaction) => {
//       if (transaction.type === "income") incomeTotal += transaction.amount;
//       else expensesTotal += transaction.amount;
//     });
//     setIncome(incomeTotal);
//     setExpenses(expensesTotal);
//     setCurrentBalance(incomeTotal - expensesTotal);
//   };

//   const toggleNewsVisibility = () => setIsNewsVisible(!isNewsVisible);

//   return (
//     <div className="dashboard-container">
//       <Header />
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <Cards
//             currentBalance={currentBalance}
//             income={income}
//             expenses={expenses}
//             showExpenseModal={showExpenseModal}
//             showIncomeModal={showIncomeModal}
//           />

//           <AddExpenseModal
//             isExpenseModalVisible={isExpenseModalVisible}
//             handleExpenseCancel={handleExpenseCancel}
//             onFinish={(values) => onFinish(values, "expense")}
//           />
//           <AddIncomeModal
//             isIncomeModalVisible={isIncomeModalVisible}
//             handleIncomeCancel={handleIncomeCancel}
//             onFinish={(values) => onFinish(values, "income")}
//           />

//           <Row gutter={16}>
//             <Card bordered={true} style={{ flex: 1 }}>
//               <h2>Financial Statistics</h2>
//               {/* Financial charts here */}
//             </Card>
//           </Row>

//           <Row gutter={16}>
//             <Button type="primary" onClick={toggleNewsVisibility}>
//               {isNewsVisible ? "Hide News" : "Show Latest News"}
//             </Button>
//           </Row>

//           {isNewsVisible && <NewsFeed />}
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import { Card, Row,Col, Spin } from "antd";
import axios from "axios";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "./TransactionSearch";
import Header from "./Header";import AddIncomeModal from "./Modals/AddIncome";
import AddExpenseModal from "./Modals/AddExpense";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";

const Dashboard = () => {
  const [user] = useAuthState(auth);

  // const sampleTransactions = [
  // {
  //   name: "Pay day",
  //   type: "income",
  //   date: "2023-01-15",
  //   amount: 2000,
  //   tag: "salary",
  // },
  // {
  //   name: "Dinner",
  //   type: "expense",
  //   date: "2023-01-20",
  //   amount: 500,
  //   tag: "food",
  // },
  // {
  //   name: "Books",
  //   type: "expense",
  //   date: "2023-01-25",
  //   amount: 300,
  //   tag: "education",
  // },
  // ];
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [news, setNews] = useState([]);

  const [isNewsLoading, setIsNewsLoading] = useState(true);


  const navigate = useNavigate();
  const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=237063670ba54165ac9952355a2ddbc0";


  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    calculateBalance();
  };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  useEffect(() => {
    // Fetch news from News API
    const fetchNews = async () => {
      try {
        const response = await axios.get(NEWS_API_URL);
        setNews(response.data.articles); // Store the news articles in state
        setIsNewsLoading(false); // Stop loading when news is fetched
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsNewsLoading(false); // Stop loading even if there's an error
        toast.error("Error fetching news. Please try again later.");
      }
    };
  
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
       const response = await axios.get(NEWS_API_URL);
       setNews(response.data.articles); 
       console.log(news)
       setIsNewsLoading(false); 
    } catch (error) {
       console.error("Error fetching news:", error);
       setIsNewsLoading(false);
       toast.error("Error fetching news. Please try again later.");
    }
 };
  

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
    lineStyle: {
      stroke: '#24a07b', // Change this color to whatever you want (e.g., 'red', '#FF5733', etc.)
      lineWidth: 3, // Optional: set the line width (default is 2)
    },
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };

  function reset() {
    console.log("resetting");
  }
  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
    borderColor: '#28a745',
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const aboutSection = (
    <div style={{ marginTop: "2rem" }}>
      <Card bordered={true} style={{ ...cardStyle, flex: 1 }}>
        <h2>About</h2>
        <p>
          Welcome to your personal finance dashboard! Track your income, expenses,
          and manage your finances easily with real-time charts and data visualization.
          Stay up-to-date with your financial health and make informed decisions to secure your future.
        </p>
        <h3>Latest News</h3>
        <ul>
          <li>New feature: Expense tracking now includes a spending breakdown by category!</li>
          <li>Stay tuned for upcoming budget analysis tools in the next update.</li>
        </ul>
      </Card>
    </div>
  );


  return (
    <div className="dashboard-container">
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Cards
            currentBalance={currentBalance}
            income={income}
            expenses={expenses}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            cardStyle={cardStyle}
            reset={reset}
          />

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2> Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>Total Spending</h2>
                  {spendingDataArray.length == 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                  ) : (
                    <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                  )}
                </Card>
              </Row>
            </>
          )}
          <TransactionSearch
            transactions={transactions}
            exportToCsv={exportToCsv}
            fetchTransactions={fetchTransactions}
            addTransaction={addTransaction}
          />

           {/* News Section */}
           {isNewsLoading ? (
            <Spin />
          ) : (
            <Row gutter={16}>
              {news.map((article, index) => (
                <Card
                  key={index}
                  bordered={true}
                  style={cardStyle}
                  title={<a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>}
                >
                  <p>{article.description}</p>
                </Card>
              ))}
            </Row>
          )}
          {aboutSection}
        </>
      )}
    </div>
  );
};


export default Dashboard;
