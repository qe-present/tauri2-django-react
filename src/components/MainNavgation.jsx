import classes from './MainNavigation.module.css';
import {NavLink} from "react-router";

function MainNavigation() {
    return (
        <header className={classes.header}>
            <nav>
                <ul className={classes.list}>
                    <li>
                        <NavLink
                            to="/"
                            className={
                                ({isActive})=>isActive ? classes.active : undefined
                            }
                            end
                        >home</NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="book"
                            className={
                                ({isActive})=>isActive ? classes.active : undefined
                            }
                            end
                        >book</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
