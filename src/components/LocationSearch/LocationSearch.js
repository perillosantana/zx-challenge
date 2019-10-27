import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { connect } from "react-redux";
import cookie from 'react-cookies';

import * as ZXActions from '../../store/actions/ZX/zx'
import PocSearchMethod from '../../querys/PocSearchMethod'
import CategoriesSearchMethod from '../../querys/CategoriesSearchMethod'
import ProductsSearchMethod from '../../querys/ProductsSearchMethod'

import './LocationSearch-styles.css';

class LocationSearch extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            address: {
                lat: '',
                lng: '',
                street: '',
                number: '',
                complement: ''
            },
            success: false
        };

        const addressCookie = cookie.load('address');
        
        if (addressCookie !== undefined) {
            this.state = {
                address: addressCookie
            };
            
            this.props.dispatch(ZXActions.toggleAddress(addressCookie, true));
            this.getPOCSearch();
        }
    }

    parseGoogleResponse(components, key) {
        let result = '';

        components.map(component => {
            let getType = component.types.filter(type => {
                return type == key;
            });

            if (getType.length) {
                result = component.long_name
            }
        });

        return result;
    }

    getAllCategoriesSearch() {
        CategoriesSearchMethod().then(result => {
            this.props.dispatch(ZXActions.addCategories(result.data.data.allCategory));
            this.getProducts();
        });
    }

    getProducts() {
        ProductsSearchMethod('532').then(result => {
            this.props.dispatch(ZXActions.addProducts(result.data.data.poc.products, false));
        });
    }

    getPOCSearch() {
        PocSearchMethod(this.state.address).then(result => {
            if (result.data.data != null && result.data.data.pocSearch.length) {
                let pocsSearch = result.data.data.pocSearch.filter(poc => {
                    return poc.status === 'AVAILABLE'
                });

                this.props.dispatch(ZXActions.addPOCSearch(pocsSearch));
                this.getAllCategoriesSearch();
            }
        });
    }

    handleChange = street => {
        this.setState(address => ({
            address: {
                ...this.state.address,
                street: street
            }
        }))
    };

    handleSelect = street => {
        geocodeByAddress(street).then(results => {
            const number = this.parseGoogleResponse(results[0].address_components, 'street_number');

            if (number.length) {
                const number = this.parseGoogleResponse(results[0].address_components, 'street_number');
                const route = this.parseGoogleResponse(results[0].address_components, 'route');
                const sublocality_level_1 = this.parseGoogleResponse(results[0].address_components, 'sublocality_level_1');
                const administrative_area_level_2 = this.parseGoogleResponse(results[0].address_components, 'administrative_area_level_2');
                const postal_code = this.parseGoogleResponse(results[0].address_components, 'postal_code');

                this.setState(address => ({
                    address: {
                        ...this.state.address,
                        street: `${route} ${sublocality_level_1} ${administrative_area_level_2} ${postal_code}`,
                        number: number
                    }
                }));
            } else {
                this.setState(address => ({
                    address: {
                        ...this.state.address,
                        street: results[0].formatted_address
                    }
                }));
            }

            return getLatLng(results[0]);
        }).then(latLng => {
            this.setState(address => ({
                success: true,
                address: {
                    ...this.state.address,
                    lat: latLng.lat,
                    lng: latLng.lng
                }
            }));
        }).catch(error => console.error('Error', error));
    };

    handleNumber = () => {
        this.setState(() => ({
            address: {
                ...this.state.address,
                number: event.target.value
            }
        }));
    }

    handleComplement = () => {
        this.setState(() => ({
            address: {
                ...this.state.address,
                complement: event.target.value
            }
        }));
    }

    handleSaveAddress = () => {
        const { address } = this.state;

        cookie.save('address', address, { path: '/' });

        this.props.dispatch(ZXActions.toggleAddress(address, true));

        this.getPOCSearch();
    }

    render() {
        const searchOptions = {
            location: new google.maps.LatLng(-23.6062156, -46.6516546),
            radius: 2000,
            types: ['address']
        };

        const { address, success } = this.state;

        return (
            <PlacesAutocomplete
                value={this.state.address.street}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={searchOptions}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <>
                        <input
                            {...getInputProps({
                                placeholder: 'Ex. Av Paulista 228',
                                className: 'location-search-input',
                            })}
                        />

                        <input onChange={this.handleNumber} value={address.number} placeholder="Número" className={`location-search-input location-search-input-number ${success ? 'show' : 'hide'}`} />
                        <input onChange={this.handleComplement} placeholder="Complemento" className={`location-search-input ${success ? 'show' : 'hide'}`} />

                        <button className={`autocomplete-button`} onClick={this.handleSaveAddress}>VER PRODUTOS</button>

                        <div className={`autocomplete-dropdown-container ${suggestions.length ? 'show' : 'hide'}`}>
                            {suggestions.map(suggestion => {
                                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';

                                return (
                                    <div {...getSuggestionItemProps(suggestion, { className, })}>
                                        <span className="suggestion-item-title">{suggestion.formattedSuggestion.mainText}</span>
                                        <span className="suggestion-item-sub-title">{suggestion.formattedSuggestion.secondaryText}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

            </PlacesAutocomplete>
        );
    }
}

export default connect(state => ({
    address: state.zx
}))(LocationSearch);