import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Home from "./Routes/Home";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/search" element={<Search />} />
          <Route path="movies/:id" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
