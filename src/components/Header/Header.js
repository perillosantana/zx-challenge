import React from 'react';
import { connect } from 'react-redux';
import './Header-styles.css';

const Header = ({ zx }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="header-logo">
                        <img src="./src/img/white-logo-horizontal.png" />
                    </div>

                    {
                        zx.address.street.length > 0 && <div className="header-address">
                            ENDEREÇO ​​DE ENTREGA
                            <span>{zx.address.street}, {zx.address.number} - {zx.type}</span>
                        </div>
                    }
                </div>
            </div>
        </header>
    );
};

export default connect(state => ({
    zx: state.zx
}))(Header);