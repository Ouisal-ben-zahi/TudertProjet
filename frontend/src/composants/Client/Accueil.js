import React from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import Slider from '../../layout/slider';
import BarreCategories from './BarreCategories';
import Images from './Images';
import AllImages from './AllImages';

const Accueil = () => {

  return (
    <div>
         <Navigation />
         <Slider/>
         <div style={{display:'flex',width:'100%'}}>
         <BarreCategories/>
        <Images />
         </div>
        <AllImages/>


        <Footer/>

    </div>
  );
};

export default Accueil;
