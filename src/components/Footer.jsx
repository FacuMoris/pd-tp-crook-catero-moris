import './style/Footer.css'

export const Footer = () => {
    return (
        <div className="row justify-content-center text-center mt-5" id='row-footer'>
            <div className="col-3">
                <div className="row align-items-center">
                    <div className="col-4">
                       
                       <img src="./img/logo/app.png" alt="logo-app" class='logo-footer'/>

                    </div>
                   
                </div>
            </div>
            <div className="col-4">
                        <p className='fs-6'> Gracias por utilizar <span>Valorant Conecta</span>,
                            esperamos que hayas podido encontrar compañeros valiosos para mejorar cada vez
                            más tu habilidad competitiva. </p>
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
        </div>
    )
};