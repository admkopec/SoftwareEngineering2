import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../resources/types';
import { Container, Typography } from '@mui/material';
import { IS_DEV } from '../resources/setup';
import Image from 'mui-image';

interface ProductInfoProps {
    productId: string | undefined
}

export default function ProductInfo(props: ProductInfoProps){
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [productData, setProductData] = React.useState<Product | null>(null);
    const [productImage, setProductImage] = React.useState<string>('');
    
    const fetchProduct = async () => {
        setIsLoading(true);
        IS_DEV && console.log(props.productId);
        await fetch(`/api/products/${props.productId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwttoken')}`
        }
        })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error(`ERROR ${response.status}`);
        })
        .then((responseJSON: Product) => {
            IS_DEV && console.log('Success fetching product.');
            IS_DEV && console.log(responseJSON);
            setProductData(responseJSON);
        })
        .catch((e) => {
            IS_DEV && console.log(`Error when trying to fetch product: ${e}`);
        });
        setIsLoading(false);
    };    

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <Container>
            <Typography>{productData?.name}</Typography>
            <Typography>{productData?.description}</Typography>
            <Typography>{productData?.price}</Typography>
            <Typography>{productData?.quantity}</Typography>
            <Typography>{productData?.category}</Typography>
            {/* <Image src={''}></Image> */}
        </Container>
    );
}