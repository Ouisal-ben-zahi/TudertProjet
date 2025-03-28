import React, { useEffect, useState } from "react";
import Footer from "../../layout/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Navigation from "../../layout/Navigation";
import "../css/panier.css";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"; // Import de l'icône de panier
import { useNavigate } from "react-router-dom";
import ValiderCommande from "./ValiderCommande";
const Panier = () => {
  const [count, setCount] = useState(0);
  const [IdUser, setIdUser] = useState(1);
  const [panier, setPanier] = useState([]);
  const [produites, setProduites] = useState([]);
  const [error, setError] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null); // État pour gérer le survol
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/ligne-commandes"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPanier(data.ligneCommandes);
        setProduites(data.produites);
        if (
          data.ligneCommandes.filter((item) => item.id_utilisateur === IdUser)
            .length === 0
        ) {
          navigate("/boutique");
          alert("Votre panier est vide. Veuillez ajouter des produits.");
        }
      } catch (error) {
        console.error("Error fetching panier data:", error);
        setError(error.message);
      }
    };

    fetchPanier();
  }, []);

  const getProduitDetails = (IdProduite) => {
    return produites.find((produite) => produite.id === IdProduite);
  };

  const calculateItemTotal = (item) => {
    const produit = getProduitDetails(item.id_produite);
    return produit ? produit.prix * item.quantité : 0;
  };

  const calculateCartTotal = () => {
    return panier
      .filter((item) => item.id_utilisateur === IdUser)
      .reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ligne-commandes/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantité: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      console.log("Quantity updated successfully:", data);

      setPanier((prevPanier) =>
        prevPanier.map((item) =>
          item.id === itemId ? { ...item, quantité: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(error.message);
    }
  };

  const handleIncrement = (itemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(itemId, newQuantity);
  };

  const handleDecrement = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(itemId, newQuantity);
    }
  };
  const handleClick = () => {
    setShowValidation(true);
  };
  const handleAddToCart = (produitId) => {
    // Logique pour ajouter un produit au panier
    console.log(`Produit ${produitId} ajouté au panier`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (showValidation) {
    return (
      <ValiderCommande
        panierItems={panier
          .filter((item) => item.id_utilisateur === IdUser)
          .map((item) => {
            const produit = getProduitDetails(item.id_produite);
            return {
              ...item,
              produit: produit,
            };
          })}
      />
    );
  }
  // Si le panier est vide
  if (panier.filter((item) => item.id_utilisateur === IdUser).length === 0) {
    return null;
  }
  return (
    <div>
      <Navigation />
      <h5 className="my-4 container">Panier</h5>

      <div className="d-flex container">
        {/* Tableau des produits */}
        <div className="product-table">
          <table className="table table-borderless custom-table">
            <thead>
              <tr>
                <th className="border-bottom-green">Produit</th>
                <th className="border-bottom-green">Prix</th>
                <th className="border-bottom-green">Quantité</th>
                <th className="border-bottom-green">Totale</th>
                <th className="border-bottom-green"></th>
              </tr>
            </thead>
            <tbody>
              {panier
                .filter((item) => item.id_utilisateur === IdUser)
                .map((item) => {
                  const produit = getProduitDetails(item.id_produite);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={`http://127.0.0.1:8000/images/${produit.image}`}
                            alt={produit.nom}
                            style={{
                              width: "50px",
                              height: "50px",
                              marginRight: "10px",
                            }}
                          />
                          {produit ? produit.nom : "Produit non trouvé"}
                        </div>
                      </td>
                      <td>{produit ? `${produit.prix} DH` : "N/A"}</td>
                      <td>
                        <button
                          style={{ margin: "5px", padding: "5px" }}
                          className="btn btn-success"
                          onClick={() =>
                            handleDecrement(item.id, item.quantité)
                          }
                          disabled={item.quantité <= 1}
                        >
                          -
                        </button>
                        {item.quantité}
                        <button
                          style={{ margin: "5px", padding: "5px" }}
                          className="btn btn-success"
                          onClick={() =>
                            handleIncrement(item.id, item.quantité)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td>{calculateItemTotal(item)} DH</td>
                      <td>
                        <a>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="delete-icon"
                            size="lg"
                            style={{ color: "red" }}
                          />
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Résumé du panier */}
        <div className="cart-summary">
          <table className="table table-borderless custom-table ms-5">
            <tbody>
              <tr>
                <th className="border-bottom-green">Totale Panier</th>
              </tr>
              <tr>
                <td className="bold-text">
                  Total d'articles :{" "}
                  <span className="bold-text">{calculateCartTotal()}</span> DH
                </td>
              </tr>
              <tr>
                <td className="bold-text">
                  Nombre d'articles :{" "}
                  {
                    panier.filter((item) => item.id_utilisateur === IdUser)
                      .length
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <button className="btn btn-success" onClick={handleClick}>
                    Valider Commande
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="/boutique">Continuer Vos Achats</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestions de produits */}
      <div className="produits-container my-4 container">
        <h5>D'autres suggestions pour vous</h5>
        <div className="produits-grid">
          {produites.map((produit) => (
            <div
              key={produit.id}
              className="produit-card"
              onMouseEnter={() => setHoveredProduct(produit.id)} // Activer le survol
              onMouseLeave={() => setHoveredProduct(null)} // Désactiver le survol
            >
              <div className="produit-image-container">
                <img
                  src={`http://127.0.0.1:8000/images/${produit.image}`}
                  alt={produit.nom}
                  className="produit-image"
                />
                <div>
                  {hoveredProduct === produit.id && ( // Afficher l'icône de panier uniquement au survol
                    <div className="bg-gray">
                      <div className="cart-icon-overlay">
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="cart-icon"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="produit-details">
                <h3 className="produit-nom">{produit.nom}</h3>
                <p className="produit-prix">{produit.prix} DH</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Panier;
