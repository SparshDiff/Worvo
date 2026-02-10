import { Link } from "react-router-dom"
import Logo from "."

const LogoName = () => {
    return (
        <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium text-foreground"
        >
            <Logo />
            <span className="text-lg font-semibold"> Worvo </span>
        </Link>


    )
}

export default LogoName