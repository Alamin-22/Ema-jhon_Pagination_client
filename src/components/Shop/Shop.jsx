import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])

    const carts = useLoaderData();

    const [itemPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    // const { count } = useLoaderData();
    const [count, setCount] = useState(0);
    // const itemsPerPage = 10;
    const numberOfPages = Math.ceil(count / itemPerPage);
    // const pages = [];
    // for (let i = 0; i < numberOfPages; i++) {
    //     pages.push(i);
    // }

    const pages = [...Array(numberOfPages).keys()]


    // console.log("pagination current page:",currentPage)


    /**
     * DONE 1: get the total number of products
     * Done 2: number of items per page dynamic
     * TODO 3: get the current page
    */


    useEffect(() => {
        fetch("http://localhost:5000/productCount")
            .then(res => res.json())
            .then(data => setCount(data.count))

    }, [])


    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // console.log(product)
        // cart.push(product); 
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = carts.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            console.log("checking remaining:",remaining)
            newCart = [...remaining, exists];
        }
        console.log("checking does exist newCart:",newCart)

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemPerPage = e => {
        const val = parseInt(e.target.value);
        console.log(val);
        setItemPerPage(val);
        setCurrentPage(0);
    }
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }
    const handleNextPage = () => {
        if (currentPage <= pages.length - 2) {
            setCurrentPage(currentPage + 1)
        }
    }



    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>Current page:{currentPage}</p>
                <button onClick={handlePrevPage}>Prev</button>
                {
                    pages.map((page, idx) => <button
                        className={currentPage === page ? "selected" : undefined}
                        // className={currentPage ? page && "selected"  }
                        onClick={() => setCurrentPage(page)}
                        key={idx}>{page}
                    </button>)
                }
                <button onClick={handleNextPage}>Next</button>
                <select name="" id="" onChange={handleItemPerPage} className='options'>
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="36">36</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;