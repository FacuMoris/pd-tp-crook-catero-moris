import './style/Footer.css'

export const Footer = () => {
    return (
        <div className="row justify-content-center text-center mt-5" id='row-footer'>
            <div className="col-2">
                <div className="row align-items-center justify-content-center">
                    <div className="col-4">

                        <img src="/img/logo/app.png" alt="logo-app" className='logo-footer' />

                    </div>

                </div>
            </div>
            <div className="col-3">
                <ul className='fs-6 pt-0 ul-footer'>
                    <li>
                        <a href="#">Contacto</a>
                    </li>
                    <li><a href="#">Sobre Nosotros</a></li>
                    <li><a href="#">Blog</a></li>
                </ul>
            </div>
            <div className="col-2">
                <img src="/img/logo/ig.png" alt="logo-ig" className='ig-logo' />
                <img src="/img/logo/x.png" alt="logo-x" className='x-logo'/>

            </div>
        </div>
    )
};