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
function App() {
  const [count, setCount] = useState(0);
  //serviceFirebase.actualizarPelicula(2, 2);
  return (
    <>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path={Path.Home} element={<Carousel />}></Route>
          <Route path={Path.Catalog} element={<Catalog />}></Route>
          <Route path={Path.MoviesList} element={<MoviesList />}></Route>
          <Route path={Path.MovieDetails} element={<MovieDetails />}></Route>
          <Route path={Path.Login} element={<Login />}></Route>
          <Route path={Path.Register} element={<Register />}></Route>
          <Route
            path={Path.CreateEditMovie}
            element={<CreateEditMovie />}
          ></Route>
        </Routes>
        <footer>{import.meta.env.VITE_APIKEY}All rights reseved &copy;</footer>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
