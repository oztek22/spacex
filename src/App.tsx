import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { availableTypes, ShipData } from "./types";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResponsiveGallery from "react-responsive-gallery";
import "./App.css";

function App() {
  const allTypes: availableTypes[] = [
    "High Speed Craft",
    "Cargo",
    "Tug",
    "Barge",
  ];
  const [error, setError] = useState<AxiosError | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ships, setShips] = useState<ShipData[]>([]);
  const [selectedTypes, setSelectedTypes] = useState(allTypes);

  // We can add infinite scroll if list items are more than 30
  useEffect(() => {
    const graphqlQuery = `{
      ships(limit: 30) {
        image
        name
        type
        active
        roles
        id
      }
    }
    `;

    axios
      .post("https://api.spacex.land/graphql", {
        query: graphqlQuery,
        varaibles: null,
      })
      .then((response) => {
        console.log(response.data.data.ships);
        setIsLoaded(true);
        setShips(response.data.data.ships);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  const updateSelectedTypes = (type: availableTypes) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(
        selectedTypes.filter((selectedType) => selectedType !== type)
      );
    } else {
      selectedTypes.push(type);
      setSelectedTypes([...selectedTypes]);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="app">
        <div className="grid-list-header">
          <h2>Space X Ships</h2>
          <div className="grid-list-options">
            {allTypes.map((type) => (
              <span
                className={selectedTypes.includes(type) ? "active" : ""}
                key={type}
                onClick={() => updateSelectedTypes(type)}
              >
                {type}
              </span>
            ))}
            <i
              className={
                !isListView ? "fas fa-th-large active" : "fas fa-th-large"
              }
              onClick={() => setIsListView(false)}
            ></i>
            <i
              className={
                isListView ? "fas fa-th-list active" : "fas fa-th-list"
              }
              onClick={() => setIsListView(true)}
            ></i>
          </div>
        </div>
        <ul>
          {isListView ? (
            <table className="grid-list-view list">
              <thead>
                <tr>
                  <td>
                    <p>Name</p>
                  </td>
                  <td>
                    <p>Type</p>
                  </td>
                  <td>
                    <p>Roles</p>
                  </td>
                  <td>
                    <p>isActive</p>
                  </td>
                </tr>
              </thead>
              <tbody>
                {ships
                  .filter((ship) => selectedTypes.includes(ship.type))
                  .map((ship) => (
                    <tr key={ship.id}>
                      <td>
                        <p>{ship.name}</p>
                      </td>
                      <td>
                        <p>{ship.type}</p>
                      </td>
                      <td>
                        <p>{ship.roles.join(", ")}</p>
                      </td>
                      <td>
                        <p>
                          {ship.active ? (
                            <FontAwesomeIcon icon={faCircleCheck} />
                          ) : (
                            <FontAwesomeIcon icon={faCircleXmark} />
                          )}
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <ResponsiveGallery
              images={ships
                .filter((ship) => selectedTypes.includes(ship.type))
                .map((ship) => {
                  return {
                    src: ship.image,
                    lightboxTitle: ship.name,
                    lightboxCaption: `${ship.name} | ${ship.type}`,
                  };
                })}
              useLightBox={true}
            />
          )}
        </ul>
      </div>
    );
  }
}

export default App;
