import axios from "axios";
import React, { useEffect, useState } from "react";
import spinner from "../../Images/spinner.gif";
import api from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import '../css/images.css';
import { toast } from "sonner";
import { useSelector } from "react-redux";
function AllImages() {
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
            total: images[hoveredIndex].prix
        });
        console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
  return (
    <div style={{width:'90%',margin:'auto',paddingTop:'50px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      {images && !loadingImages ? (
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center',gap:'100px'}}>
          {images.map((image, index) => (
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
                  <button className="cart-icon" style={{border:'1px solid green',backgroundColor:'transparent',cursor:'pointer'}}>
                    <FontAwesomeIcon icon={faCartShopping} size="sm" onClick={handleAddPanier}/>
                  </button>
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

export default AllImages;
