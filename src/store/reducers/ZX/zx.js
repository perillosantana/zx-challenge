import cookie from 'react-cookies';

const addressCookie = cookie.load('address');
const cartCookie = cookie.load('cart');

const INNITIAL_STATE = {
    type: 'Entrega',
    address: {
        lat: '',
        lng: '',
        street: '',
        number: '',
        complement: ''
    },
    POC: [],
    loading: false,
    categories: [],
    products: null,
    categoryActive: null,
    searchQuery: '',
    cart: null
}

if (addressCookie !== undefined) {
    INNITIAL_STATE.address = addressCookie;
}

if (cartCookie !== undefined) {
    INNITIAL_STATE.cart = cartCookie;
}

function zx(state = INNITIAL_STATE, action) {
    if (action.type === 'TOGGLE_ZX_ADDRESS') {
        return {
            ...state,
            address: action.address,
            loading: action.loading
        }
    }

    if (action.type === 'TOOGLE_ZX_ADDRESS_TYPE') {
        return {
            ...state,
            type: action.addressType
        }
    }
    
    if (action.type === 'ADD_ZX_POCSearch') {
        return {
            ...state,
            POC: action.POCSearch
        }
    }

    if (action.type === 'ADD_ZX_CATEGORIES') {
        return {
            ...state,
            categories: action.categories
        }
    }

    if (action.type === 'ADD_ZX_PRODUCTS') {
        return {
            ...state,
            products: action.products,
            loading: action.loading
        }
    }

    return state;
}

export default zx;