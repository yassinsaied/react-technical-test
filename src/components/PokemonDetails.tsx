import { useState, useEffect } from "react";
import { Pokemon } from "pokenode-ts";
import { fetchPokemonDetails } from "src/hooks/usePokeApi";
import { useParams, Link } from "react-router-dom";

interface RouteParams {
  [key: string]: string;
}

const PokemonDetails = () => {
  const { namePokemon } = useParams<RouteParams>();

  // Utilisez useState pour stocker les détails du Pokémon
  const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);

  // Utilisez useEffect pour charger les détails du Pokémon lors du montage du composant
  useEffect(() => {
    if (namePokemon) {
      // Vérifiez si namePokemon est défini
      // Appelez la fonction pour récupérer les détails du Pokémon
      fetchPokemonDetails(namePokemon).then((details) => {
        // Mettez à jour l'état avec les détails du Pokémon récupérés
        setPokemonDetails(details);
      });
    }
  }, [namePokemon]);

  if (!pokemonDetails) {
    return <div>Loading...</div>;
  }

  // Vérifiez si pokemonDetails.species est défini avant d'accéder à pokemonDetails.species.url

  // Affichez les détails du Pokémon
  return (
    <div className="pokemon-details">
      <div className="pokemon-header">
        <h2 className="pokemon-name">{pokemonDetails.name}</h2>
      </div>
      <div className="pokemon-body">
        <div className="pokemon-image">
          <img
            src={pokemonDetails.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
            alt={pokemonDetails.name}
          />
        </div>
        <div className="pokemon-info">
          <p>
            <strong>Height:</strong> {pokemonDetails.height}
          </p>
          <p>
            <strong>Weight:</strong> {pokemonDetails.weight}
          </p>
          {
            <Link className="back" to="/">
              Go Home{" "}
            </Link>
          }
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
