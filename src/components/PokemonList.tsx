import { useState, useEffect } from "react";
import { Pokemon, PokemonSpecies } from "pokenode-ts";
import usePokeApi, { getLocalizedName, resolveResources } from "src/hooks/usePokeApi";
import { Link } from "react-router-dom";

interface PokemonProps {
  pokemon: Pokemon;
  addToTeam?: (pokemon: Pokemon) => void; // Fonction pour ajouter un Pokémon à l'équipe
  removeFromTeam?: (pokemon: Pokemon) => void; // Fonction pour retirer un Pokémon à l'équipe
}

function Pokemon({ pokemon, addToTeam, removeFromTeam }: PokemonProps) {
  const { data: species } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonSpecies>(pokemon.species.url));

  return species ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "3em", marginRight: "10px" }}>
        <img
          src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
          style={{ height: "3em" }}
          alt={`${pokemon.name} sprite`}
        />
      </div>
      <div style={{ marginRight: "10px" }}>
        <Link to={`/pokemon/${pokemon.name}`}>{getLocalizedName(species)}</Link>
      </div>
      <div>
        {addToTeam && (
          <button className="addTeam" onClick={() => addToTeam(pokemon)}>
            Ajouter à l'équipe
          </button>
        )}

        {removeFromTeam && (
          <button className="addTeam" onClick={() => removeFromTeam(pokemon)}>
            Retirer de l'équipe
          </button>
        )}
      </div>
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "3em", marginRight: "10px" }}>
        <img src={"src/assets/pokeball.png"} style={{ height: "3em" }} alt="Pokeball" />
      </div>
      <div></div>
    </div>
  );
}

function PokemonList() {
  //data of POKEMON
  const { data: pokemon } = usePokeApi((api) => api.pokemon.listPokemons(0, 10).then(resolveResources<Pokemon>));
  // type of team
  const uniqueTypes = new Set<string>();
  const [typeTeam, setTypeTeam] = useState<string[]>();

  // État pour stocker la valeur du champ de recherche
  const [searchQuery, setSearchQuery] = useState<string>("");
  // État pour stocker la liste des Pokémon
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value); // Mettre à jour la valeur du champ de recherche à chaque changement
  };

  useEffect(() => {
    if (pokemon) {
      setPokemonList(pokemon.results);
    }
    setSearchQuery("");
  }, [pokemon]);

  // État pour stocker l'équipe de Pokémon
  const [team, setTeam] = useState<Pokemon[]>([]);

  useEffect(() => {
    team.forEach((pokemon) => {
      // Parcourir chaque type du Pokémon
      pokemon.types.forEach((type) => {
        // Ajouter le type à l'ensemble des types uniques
        uniqueTypes.add(type.type.name);
      });
    });
    setTypeTeam(Array.from(uniqueTypes));
  }, [team]);

  // Fonction pour ajouter un Pokémon à l'équipe
  const addToTeam = (pokemon: Pokemon) => {
    if (team.length < 6 && !team.some((p) => p.id === pokemon.id)) {
      setTeam((prevTeam) => [...prevTeam, pokemon]);
    }
  };

  // Fonction pour retirer un Pokémon de l'équipe
  const removeFromTeam = (pokemon: Pokemon) => {
    setTeam((prevTeam) => prevTeam.filter((p) => p.id !== pokemon.id));
  };

  // const typeTeamString = typeTeam?.map((type) => {
  //   console.log(type);
  // });
  if (!pokemonList) return <div>Chargement ...</div>;

  return (
    <div className="container">
      {/* Liste des Pokémon */}
      <div className="pokemon-list">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchInput"
        />

        <div>
          {pokemonList
            .filter((p) => searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((p) => (
              <div className="pokemonItem" key={p.id}>
                <Pokemon pokemon={p} addToTeam={addToTeam} />
              </div>
            ))}
        </div>
      </div>

      {/* Équipe de Pokémon */}
      <div className="pokemon-team">
        {team.length >= 1 && (
          <>
            <h2>votre Équipe de Pokémon de type : </h2>
            <h4>{typeTeam?.join(",")}</h4>
          </>
        )}

        {team.length >= 6 && (
          <div className="teamLimitMessage">Vous avez atteint la limite maximale de 6 Pokémon dans votre équipe.</div>
        )}

        {team.map((p) => (
          <div className="pokemonItem" key={p.id}>
            <Pokemon key={p.id} pokemon={p} removeFromTeam={removeFromTeam} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonList;
