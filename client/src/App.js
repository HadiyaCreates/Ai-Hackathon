import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./header/navbar";
import Hero from "./header/Hero";
import Core from "./header/Core";
import Home from "./header/Home";
import Footer from "./Footer/Footer";
import AuthPage from "./Login/AuthPage";
import AmbassadorPage from "./Ambassador/AmbassadorPage";
import AdminPage from "./Admin/AdminPage";
import Leaderboard from "./Ambassador/Leaderboard";
function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai", {
        prompt: input,
      });

      setResponse(res.data.result);
    } catch (err) {
      setResponse("Error fetching response");
    }

    setLoading(false);
  };

  return (
    // <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
    //   <h1>AI Hackathon Starter</h1>

    //   <textarea
    //     rows="4"
    //     style={{ width: "100%", marginBottom: "10px" }}
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //     placeholder="Enter your prompt..."
    //   />

    //   <button onClick={handleSubmit}>Submit</button>

    //   {loading && <p>Loading...</p>}

    //   {response && (
    //     <div style={{ marginTop: "20px" }}>
    //       <h3>Response:</h3>
    //       <p>{response}</p>
    //     </div>
    //   )}
    // </div>
<Router>
  <Navbar/>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/auth" element={<AuthPage/>}/>
    <Route path="/ambassador" element={<AmbassadorPage/>}/>
    <Route path="/admin" element={<AdminPage/>}/>
    <Route path="/leaderboard" element={<Leaderboard/>}/>
    {/* <Route path="/" element={<Core/>}/> */}
  </Routes>
  <Footer/>
</Router>
  );
}

export default App;