import './style/Card.css'



export const Card = (props) => {

    const col = props.col;
    const clases = 'col-' + col + ' mb-4 me-4 border px-3 py-5';

    if (props.img != undefined) {

        return (
            <>
                <div className={clases}>
                    <h2 className="text-center mb-5">{props.titulo}</h2>
                    <p className="fs-5 mx-5">{props.descripcion}</p>
                    <img className='card-img' src={props.img} />
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className={clases}>
                    <h2 className="text-center mb-5">{props.titulo}</h2>
                    <p className="fs-5 mx-5">{props.descripcion}</p>
                </div>
            </>
        )
    }
}