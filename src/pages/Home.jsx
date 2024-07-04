import { Menu } from "../components/Menu"
import { HomeText } from "../components/HomeText"
import './styles/Home.css'
import { Footer } from "../components/Footer"

export const Home = () => {

    return (
        <>
            <div className="col-12 mt-4" id="title-row">
                <h1 className="text-center mb-5">Home</h1>
            </div>
            <div className="row home-row justify-content-center align-items-center">
                <div className="col-6">
                    <HomeText />
                </div>
                <div className="col-6">
                    <div className="row justify-content-center">
                        <img id='home-banner' src="/img/bg/banner-valo.jpg" alt="banner-valorant" className="d-flex" />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}