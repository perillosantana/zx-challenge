import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import * as ZXActions from '../../store/actions/ZX/zx'
import ProductsSearchMethod from '../../querys/ProductsSearchMethod'
import Loading from "../../components/Loading/Loading";

import './ProductWrapper-styles.css';

class ProductWrapper extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            category: null,
            search: '',
            loading: false
        };

        if (this.props.zx.cart !== null) {
            this.state = {
                ...this.state,
                cart: this.props.zx.cart
            };
        } else {
            this.state = {
                ...this.state,
                cart: {
                    items: [],
                    total: 0
                }
            };
        }

        this.searchInput = React.createRef();
    }

    checkItem(productId) {
        const { cart } = this.state;

        let items = cart.items.filter((item) => {
            return item.productId == productId
        });

        if (items.length)
            return true;

        return false;
    }

    handleAddLess = (productId, price) => {
        const element = document.getElementById(productId);

        if (element.value <= 1) {
            element.value = 0
        } else {
            element.value--
        }

        this.updateCart(element.value, productId, price);
    }

    handleAddMore = (productId, price) => {
        const element = document.getElementById(productId);
        element.value++;

        this.updateCart(element.value, productId, price);
    }

    handleInputChange = (value, productId, price) => {
        this.updateCart(value, productId, price);
    }

    updateCart(value, productId, price) {
        this.setState(state => {
            const items = state.cart.items;

            if (value <= 0) {
                state.cart.items.map((item, index) => {
                    if (item.productId == productId) {
                        state.cart.items.splice(index, 1);
                    }
                });
            } else {
                if (state.cart.items.length) {
                    state.cart.items.map((item, index) => {
                        if (item.productId == productId) {
                            return item.quantity = value;
                        } else {
                            if (!this.checkItem(productId)) {
                                return items.push({
                                    productId: productId,
                                    quantity: value,
                                    price: price
                                });
                            }
                        }
                    });
                } else {
                    items.push({
                        productId: productId,
                        quantity: value,
                        price: price
                    });
                }
            }

            let total = 0;

            state.cart.items.map((item) => {
                let totalItem = item.quantity * item.price;

                return total = (parseFloat(total) + totalItem).toFixed(2);
            })

            state.cart.total = total;
            cookie.save('cart', state.cart, { path: '/' });

            return {
                cart: {
                    ...state.cart,
                    items,
                    total
                }
            };
        });
    }

    checkCartCookie() {
        if (this.props.zx.products.length) {
            if (this.props.zx.cart !== null) {
                this.props.zx.cart.items.map((item) => {
                    const element = document.getElementById(item.productId);

                    if (element) {
                        element.value = item.quantity;
                    }
                });
            }
        }
    }

    componentDidMount() {
        this.checkCartCookie();
    }

    componentDidUpdate() {
        this.checkCartCookie();
    }

    handleSelectChange = (value) => {
        this.setState((state) => ({
            category: value,
            search: state.search,
            loading: true
        }))

        this.getProducts(this.state.search, value);
    }

    handleSearchChange = (evt, value) => {
        evt.preventDefault();

        this.setState((state) => ({
            category: state.category,
            search: value,
            loading: true
        }))
        
        this.getProducts(value, this.state.category);
    }

    getProducts(search = '', category = null) {
        if (category != null && !category.length)
            category = null;
        
        ProductsSearchMethod('532', search, category).then(result => {
            this.setState({ loading: false });
            this.props.dispatch(ZXActions.addProducts(result.data.data.poc.products, false));
        });
    }

    render() {
        const { zx } = this.props;
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        })
        const total = this.state.cart.total == 0 ? ('00,00').split(',') : formatter.format(this.state.cart.total).replace(/R\$/g, '').trim().split(',');

        return (
            <>
                {
                    this.state.loading == true && <Loading />
                }

                <div className="container-product">
                    <div className="products-filter">
                        <div className="products-filter-category">
                            <select onChange={(evt) => this.handleSelectChange(evt.target.value)}>
                                <option value={''}>Selecione</option>

                                {
                                    zx.categories.map((category, index) => {
                                        return (
                                            <option key={index} value={category.id}>{category.title}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="products-filter-search">
                            <form onSubmit={(evt) => this.handleSearchChange(evt, this.searchInput.current.value)}>
                                <input placeholder="Buscar" ref={this.searchInput} />
                                <button><img src="/src/img/bt-mag-glass.png" /></button>
                            </form>
                        </div>
                    </div>

                    <div className="products-wrapper">
                        {
                            zx.products.length <= 0 && <div className="product-search-empty">
                                Busca sem resultados
                            </div>
                        }

                        {
                            zx.products.map( (product) => {
                                return (
                                    <div className="product-item" key={product.id}>
                                        <div className="product-item-wrapper">
                                            <h3 className="product-item-title">{product.title}</h3>

                                            <div className="product-item-img">
                                                <img src={product.images[0].url} />
                                            </div>

                                            {
                                                product.productVariants.length ?
                                                    <div className="product-item-price">
                                                        {
                                                            formatter.format(product.productVariants[0].price).replace(/R\$/g, '').trim()
                                                        }

                                                    </div>
                                                    :
                                                    <div className="product-item-unavailable">Porduto Indisponivel <br /> 😥</div>
                                            }

                                            {
                                                product.productVariants.length > 0 && <div className="product-add-cart">
                                                    <div className="product-add-remove" onClick={() => this.handleAddLess(product.id, product.productVariants[0].price)}>-</div>

                                                    <div className="product-add-input">
                                                        <input id={product.id} type="tel" placeholder="0" onChange={(evt) => this.handleInputChange(evt.target.value, product.id, product.productVariants[0].price)} />
                                                    </div>

                                                    <div className="product-add-add" onClick={() => this.handleAddMore(product.id, product.productVariants[0].price)}>+</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="product-fixed-float-bar">
                    <div className="container">
                        <span className="product-fixed-float-bar-total">Total</span>
                        <span className="product-fixed-float-bar-value">
                            <span className="product-fixed-float-bar-total-1">{total[0]},</span><span className="product-fixed-float-bar-total-2">{total[1]}</span>
                        </span>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(state => ({
    zx: state.zx
}))(ProductWrapper);