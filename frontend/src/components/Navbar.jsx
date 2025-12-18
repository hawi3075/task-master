import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure this path is correct

const Navbar = () => {
    const { user } = useAuth();

    /**
     * Complete Logout Logic:
     * 1. Clears all LocalStorage (tokens and user data)
     * 2. Force-replaces the URL to /login
     * 3. Triggers a full browser reload to kill any stuck CSS/Overlays
     */
    const handleLogout = () => {
        // Clear all storage to remove old tokens and user objects
        localStorage.clear();
        
        // Force a total browser reload to the login page
        // This removes the dark overlay and resets the React state
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
                    {/* The Logout Button triggers the hard reset */}
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
        backgroundColor: '#2563eb', // Solid blue header
        color: '#fff',
        zIndex: 1000, // Ensures it stays above overlays
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
        backgroundColor: '#ef4444', // Red for logout
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