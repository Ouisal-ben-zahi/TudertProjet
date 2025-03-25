import axios from "axios";
import React, { useEffect, useState } from "react";
import spinner from "../../Images/spinner.gif";
import api from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import '../css/images.css';
import { useSelector } from "react-redux";
import { toast } from "sonner";
function Images() {
  const [loadingImages, setLoadingImages] = useState(false);
  const [images, setImages] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getImages = async () => {
    setLoadingImages(true);
    try {
      const res = await api.get("/produites");
      console.log(res.data);
      setImages(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoadingImages(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const utilisateur = useSelector((state) => state.utilisateurs.utilisateurActuel);
  
    const handleAddPanier = async () => {
    if(!utilisateur) return toast.error("Vous devez vous connecter pour ajouter un produit au panier",{ position: "top-right",style:{color:'red'}});
    try {
        const res = await api.post("/ligne-commandes", {
            produit: images[hoveredIndex]._id,
            quantite: 1,
            id_utilisateur: utilisateur.id,
            total: images[hoveredIndex].prix
        },{
            headers: {
                Authorization: `Bearer ${utilisateur.token}`,
            },
        });
        console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
  return (
    <div className="image-container">
      <h3 className="title">TOUTES LES PLANTES</h3>
      {images && !loadingImages ? (
        <div className="grid-container">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className="image-wrapper"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="image-box">
                <img
                  src={image.image}
                  alt={image.nom}
                  className={`plant-image ${hoveredIndex === index ? "zoom-in" : ""}`}
                />
                {hoveredIndex === index && (
                  <div>
                  <button className="cart-icon" style={{color:'black',display:'flex',gap:'10px',cursor:'pointer',alignItems:'center'}}>
                    <FontAwesomeIcon icon={faCartShopping} size="xs" className="icons" onClick={handleAddPanier}/>
                    <FontAwesomeIcon icon={faHeart}  size="xs" className="icons"/>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" className="icons"/>
                  </button>
                  </div>
                  
                )}
              </div>
              <p>{image.nom}</p>
              <h6 className="price">{image.prix} MAD</h6>
            </div>
          ))}
        </div>
      ) : (
        <img src={spinner} alt="spinner" className="spinner" style={{width:'30px',marginTop:'30px',marginBottom:'30px'}}/>
      )}
    </div>
  );
}

export default Images;
