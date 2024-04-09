import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonList from "./PokemonList";
import PokemonDetails from "./PokemonDetails";

function Footer() {
  return (
    <div style={{ marginTop: "2em" }}>
      <div>
        <a href="https://pokenode-ts.vercel.app/">Doc API Pokemon</a>
      </div>
      <div>
        <a href="https://www.xplortechnologies.com/fr/travailler-chez-nous">Xplor Technologies</a>
      </div>
      <div>
        © 1998 Pokémon.{" "}
        <a href="https://t.ly/uBmFu" rel="copyright">
          ©
        </a>{" "}
        1995–2023 Nintendo/Creatures Inc./GAME FREAK inc. Pokémon
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <img src="src/assets/logo.png" width="800" />
        <h1 className="rainbow">Bienvenue sur le site des amis des pokemons</h1>
        <h5 className="blink">⭐ Yay ! ⭐</h5>
        <br />
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:namePokemon" element={<PokemonDetails />} />
        </Routes>
        <img src="src/assets/pokedex.png" />
        <Footer />
      </Router>
    </>
  );
}

export default App;
