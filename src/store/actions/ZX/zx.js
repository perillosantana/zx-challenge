export function toggleAddress(address, loading) {
    return {
        type: 'TOGGLE_ZX_ADDRESS',
        address,
        loading
    }
}

export function toogleAddressType(addressType) {
    return {
        type: 'TOOGLE_ZX_ADDRESS_TYPE',
        addressType
    }
}

export function addPOCSearch(POCSearch) {
    return {
        type: 'ADD_ZX_POCSearch',
        POCSearch
    }
}

export function addCategories(categories) {
    return {
        type: 'ADD_ZX_CATEGORIES',
        categories
    }
}

export function addProducts(products, loading) {
    return {
        type: 'ADD_ZX_PRODUCTS',
        products,
        loading
    }
}