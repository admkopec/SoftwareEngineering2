import Container from '@mui/material/Container';
import React from 'react';
import { Params, useParams } from 'react-router-dom';
import ProductInfo from '../components/ProductInfo';

export default function ProductInfoPage(){
    const { productIdParam } : Readonly<Params<string>> = useParams();
    
    return (
        <Container>
            <ProductInfo productId={productIdParam}/>
        </Container>
    );
}