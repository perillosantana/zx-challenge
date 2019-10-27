import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import ProductWrapper from "../../components/ProductWrapper/ProductWrapper";

const index = ({ zx }) => {
    return (
        <>
            {
                zx.products === null ? <Redirect to={'/'} /> : <ProductWrapper />
            }
        </>
    );
};

export default connect(state => ({
    zx: state.zx
}))(index);