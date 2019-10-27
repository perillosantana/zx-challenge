import React from 'react';
import { connect } from 'react-redux';
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import AddressCapture from "../../components/AddressCapture/AddressCapture";
import { Redirect } from 'react-router-dom'

const index = ({ zx }) => {
    return (
        <>
            {
                zx.loading && <Loading />
            }

            {
                zx.products != null && <Redirect to={'/products'} />
            }

            <AddressCapture />
            <Footer />
        </>
    );
};

export default connect(state => ({
    zx: state.zx
}))(index);