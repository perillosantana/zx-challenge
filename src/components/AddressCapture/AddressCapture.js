import React from 'react';
import { connect } from "react-redux";

import LocationSearch from "../LocationSearch/LocationSearch";
import * as ZXActions from '../../store/actions/ZX/zx'

import './AddressCapture-styles.css';

const AddressCapture = ({ addressType, dispatch }) => {
    return (
        <div className="container">
            <div className="address-capture-wrapper">
                <h2 className="address-capture-title">Bebida gelada, rápida a preço baixo</h2>
                <p className="address-capture-sub-title">Pra curtir qualquer momento</p>

                <div className="address-capture">
                    <div className="address-capture-type">
                        <button className={`address-capture-type-delivery ${addressType == 'Entrega' ? 'active' : ''}`} onClick={() => dispatch(ZXActions.toogleAddressType('Entrega'))}>Entrega</button>
                        <button className={`address-capture-type-withdrawal ${addressType == 'Retirada' ? 'active' : ''}`} onClick={() => dispatch(ZXActions.toogleAddressType('Retirada'))}>Retirada</button>
                    </div>

                    <div className="address">
                        <LocationSearch></LocationSearch>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(state => ({
    addressType: state.zx.type
}))(AddressCapture);