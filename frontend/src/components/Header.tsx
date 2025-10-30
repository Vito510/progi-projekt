import './Header.css';
import Button from './Button';

export default function Header() {
    return (
        <header>
            <section className="row">
                <img src="/images/logo.png" alt="logo"/>
                <h1>Planinarko</h1>
            </section>
            <section className="row wide">
                <Button>
                    <p>Sign in</p>
                    <i className="fa fa-sign-in fa-lg"></i>
                </Button>
            </section>
        </header>
    );
};