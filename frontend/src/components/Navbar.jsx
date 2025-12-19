import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const Navbar = () => {
    const { user } = useAuth();

   
    const handleLogout = () => {
       
        localStorage.clear();
        
        
        window.location.replace('/login'); 
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/" style={styles.link}>TaskMaster</Link>
            </div>
            
            <ul style={styles.navLinks}>
                {user && (
                    <li>
                        <Link to="/" style={styles.link}>Dashboard</Link>
                    </li>
                )}
                <li>
                   
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2563eb', 
        color: '#fff',
        zIndex: 1000, 
        position: 'relative'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '20px',
        alignItems: 'center',
        margin: 0
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: '500'
    },
    logoutBtn: {
        backgroundColor: '#ef4444', 
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    }
};

export default Navbar;