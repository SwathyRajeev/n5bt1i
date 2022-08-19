import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

const getTrans = async () => {
  const res = await axios.get(`user-transaction`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  return res.data;
};

const WalletList = () => {
  const errRef = useRef();

  //   const [coinRate, setRate] = useState(1864807.37);
  const [transHistory, setTransHistory] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const getTransaction = async () => {
      const cb = await getTrans();
      setTransHistory(cb);
    };
    getTransaction();
  }, []);

  return (
    <>
      <div>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <div className="container">
          <h1>Transaction History</h1>
          <span>
            <Link to="/wallet">Back</Link>
          </span>
          <div>
            {transHistory.map((item) => (
              <div className="list">
                <div className="wrapper">
                  <span>
                    From: <span className="h5">{item.sender}</span>
                  </span>
                  <span>
                    To: <span className="h5">{item.receiver}</span>
                  </span>
                  <span>
                    Date: <span className="h5">{item.date}</span>
                  </span>
                  <br />
                  <span>
                    Coin count: <span className="h1">{item.coin_count}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletList;
