import { Menu } from "../components/Menu"
import { HomeText } from "../components/HomeText"
import './styles/Home.css'
import { Footer } from "../components/Footer"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"

export const Home = () => {

    const { token } = useAuth();
    const [welcome, setWelcome] = useState('');

    useEffect(() => {
        getWelcome();
    }, []);

    const getWelcome = async () => {
        try {
            const request = await axios.get('http://localhost:8888/welcome', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setWelcome(request.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="col-12 mt-4" id="title-row">
                <h2 className="text-center mb-5 mt-5">HOME</h2>
            </div>
            <div className="row home-row justify-content-center align-items-center">
                <div className="col-6">
                    <HomeText welcome={welcome} />
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