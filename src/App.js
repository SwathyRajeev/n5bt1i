import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./page/sign-in/SignIn";
import SignUp from "./page/sign-up/SignUp";
import Wallet from "./page/wallet/Wallet";
import WalletList from "./page/wallet/WalletList";
import "./styles.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/sign-up" element={<SignUp />} />
          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/wallet" element={<Wallet />} />
          <Route exact path="/wallet-list" element={<WalletList />} />
        </Routes>
      </div>
    </Router>
  );
}
