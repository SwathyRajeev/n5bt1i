import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
const TRANSACTION_URL = "user-transaction";
import jwt_decode from "jwt-decode";

const currentBalanceFn = async () => {
  const res = await axios.get(`user-transaction/current-balance`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  return parseFloat(res.data.current_balance);
};

const Wallet = () => {
  const navigate = useNavigate();
  const moneyRef = useRef();
  const errRef = useRef();
  const [coinRate, setRate] = useState(100.37);
  //   const [coinRate, setRate] = useState(1864807.37);
  const [remainingBalance, setRemainingBalance] = useState(0.0);
  const [currentBalance, setCurrentBalance] = useState(0.0);
  const [coin, setCoin] = useState(0.0);
  const [money, setMoney] = useState(0.0);
  const [account_id, setAccountId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    moneyRef.current.focus();
    const getCB = async () => {
      const cb = await currentBalanceFn();
      setRemainingBalance(parseFloat(cb));
      setCurrentBalance(parseFloat(cb));
    };
    getCB();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [money, coin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let { user_id } = jwt_decode(localStorage.getItem("accessToken"));
      const response = await axios.post(
        TRANSACTION_URL,
        {
          transaction_type: "SEND",
          coin: "EXAMPLE",
          coin_count: parseFloat(coin),
          account_id,
          user_id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      setSuccess(true);
      navigate("/wallet-list");
    } catch (err) {
      if (err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing data");
      } else if (err.response?.status === 401) {
        setErrMsg(response?.data?.message);
      } else {
        setErrMsg("Wallet updating Failed");
        console.log(err);
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Transferred</h1>
          <br />
        </section>
      ) : (
        <div className="wallet">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Transfer</h1>
          <p>1 Coin = ₹ {coinRate}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="money">In Rupees:</label>
            <input
              type="text"
              id="money"
              ref={moneyRef}
              autoComplete="off"
              onChange={(e) => {
                setMoney(e.target.value);
                if (e.target.value > 0) {
                  if (currentBalance * coinRate < e.target.value) {
                    setCoin(0);
                    setMoney(0);
                    alert("Insufficient balance");
                  } else {
                    let coin_count = e.target.value / coinRate;
                    setCoin(coin_count);
                    setRemainingBalance(currentBalance - coin_count);
                  }
                }
              }}
              value={money}
              required
            />

            <label htmlFor="coin">Coin:</label>
            <input
              type="coin"
              id="coin"
              onChange={(e) => {
                setCoin(e.target.value);
                if (e.target.value > 0) {
                  if (currentBalance < e.target.value) {
                    setCoin(0);
                    setMoney(0);
                    alert("Insufficient balance");
                  } else {
                    let mny = e.target.value * coinRate;
                    setMoney(mny);
                    setRemainingBalance(currentBalance - coin);
                  }
                }
              }}
              value={coin}
              required
            />
            <label htmlFor="account_id">Account id:</label>
            <input
              type="account_id"
              id="account_id"
              onChange={(e) => setAccountId(e.target.value)}
              value={account_id}
              required
            />
            <label htmlFor="remainingBalance">
              Current Balance: {currentBalance} (₹
              {currentBalance * coinRate})
            </label>

            <label htmlFor="remainingBalance">
              Remaining Balance: {remainingBalance} (₹
              {remainingBalance * coinRate})
            </label>

            <button>Transfer</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Wallet;
