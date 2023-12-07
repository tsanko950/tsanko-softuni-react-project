import { useState } from "react";
import MoviesList from "./components/Movies/MoviesList";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Catalog from "./components/Catalog/Catalog";
import Carousel from "./components/Carousel/Carousel";
import CreateEditMovie from "./components/Movies/CreateEditMovie";
import Footer from "./components/Footer/Footer";
import MovieDetails from "./components/Movies/MovieDetails";
import Path from "./paths";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import { AuthProvider } from "./contexts/autoContext";
import Logout from "./components/Authentication/Logout";
import Home from "./components/Home/Home";
function App() {
  const [count, setCount] = useState(0);
  //serviceFirebase.actualizarPelicula(2, 2);
  return (
    <>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path={Path.Home} element={<Home />}></Route>
          <Route path={Path.Catalog} element={<Catalog />}></Route>
          <Route path={Path.MoviesList} element={<MoviesList />}></Route>
          <Route path={Path.MovieDetails} element={<MovieDetails />}></Route>
          <Route path={Path.Login} element={<Login />}></Route>
          <Route path={Path.Register} element={<Register />}></Route>
          <Route path={Path.Logout} element={<Logout />}></Route>
          <Route
            path={Path.CreateEditMovie}
            element={<CreateEditMovie />}
          ></Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
