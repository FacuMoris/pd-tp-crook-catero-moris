import './style/Footer.css'

export const Footer = () => {
    return (
        <footer id="row-footer">
            <div className="container-fluid px-0">
                <div className="row justify-content-center text-center g-0">
                    <div className="col-12 col-md-2">
                        <div className="row align-items-center justify-content-center g-0">
                            <div className="col-4 col-md-12">
                                <img src="/img/logo/app.png" alt="logo-app" className="logo-footer" />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <ul className="fs-6 pt-0 ul-footer">
                            <li><a href="#">Contacto</a></li>
                            <li><a href="#">Sobre Nosotros</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>

                    <div className="col-12 col-md-2">
                        <img src="/img/logo/ig.png" alt="logo-ig" className="ig-logo" />
                        <img src="/img/logo/x.png" alt="logo-x" className="x-logo" />
                    </div>
                </div>
            </div>
        </footer>
    )
};
